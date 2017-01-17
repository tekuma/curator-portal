// artworks search server - routines for searching, db connection
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston


const assert = require('assert');
const fs = require('fs');

const uuid = require('node-uuid');

const bunyan = require('bunyan');
var logger = bunyan.createLogger({
    name: 'serv/search',
    level: (process.env.NODE_ENV === 'production' ? 'warn' : 'debug')
});


var db_provider
var db;
var db_config;


function dbq(sql_template, qelems, resolve_rows) {
    if (resolve_rows === undefined)
        resolve_rows = true;

    return new Promise(function(resolve, reject) {
        var handle_resp = (function (err, rows) {
            assert.ifError(err);
            if (resolve_rows) {
                resolve(rows);
            } else {
                resolve();
            }
        });
        if (db_provider === 'mysql') {
            var q = db.query(sql_template, qelems, handle_resp);
            logger.debug(q.sql);
        } else {  // === 'sqlite'
            db.all(sql_template, qelems, handle_resp);
        }
    });
}


// USAGE: get_othersize( url, size )
//
// `url` is the reference thumbnail URL
//
// `size` (integer) width in pixels (128 or 512), or 0 to get full
// size (a.k.a. "raw" image).
//
// Return the new URL or null if error occurred during parsing.
exports.get_othersize = (url, size) => {
    var new_url;
    if (url.indexOf('/thumb128/') === -1) {
        return null;
    }

    if (size === 512 || size === 128) {
        return url.replace(/\/thumb128\//, '/thumb'+String(size)+'/');
    } else if (size === 0) {
        return url.replace(/\/thumb128\//, '/uploads/');
    } else {
        return null;
    }

    return new_url;
}


exports.connectdb = (dbconf, provider) => {
    if (typeof provider === 'undefined') {
        provider = 'mysql';
    }

    if (provider.toLowerCase() === 'sqlite'
        || provider.toLowerCase() === 'sqlite3') {
        provider = 'sqlite';  // Normalize provider name

        var sqlite3 = require('sqlite3');
        db = new sqlite3.Database(':memory:');
        logger.info('Connected to SQLite in-memory database.');

    } else if (provider.toLowerCase() === 'mysql') {
        provider = 'mysql';  // Normalize provider name

        const mysql = require('mysql');
        if (dbconf.ssl) {
            logger.debug('Found pointers to SSL credentials from database configuration.')
            logger.debug('Attempting to read from /cert/{'
                         +dbconf.ssl.ca+','+dbconf.ssl.cert+','+dbconf.ssl.key+'}');
            dbconf.ssl.ca = fs.readFileSync(__dirname + '/cert/' + dbconf.ssl.ca);
            dbconf.ssl.cert = fs.readFileSync(__dirname + '/cert/' + dbconf.ssl.cert);
            dbconf.ssl.key = fs.readFileSync(__dirname + '/cert/' + dbconf.ssl.key);
        }
        dbconf.charset = 'utf8';
        db = mysql.createConnection(dbconf);
        db.connect();
        logger.info('Connected to MySQL database at', dbconf.host);

    } else {
        throw new Error('Unrecognized database provider: "'+String(provider)+'"');
    }

    db_provider = provider;
    db_config = dbconf;
    return db;
}

exports.provider = () => {
    return db_provider;
}

exports.cleardb = () => {
    if (db_provider === 'sqlite') {
        return (new Promise(function(resolve, reject) {

            db.serialize(function () {
                const initdb = fs.readFileSync('conf/initdb.sql',
                                               {encoding: 'utf-8'});
                initdb_lines = initdb.split('\n');
                for (let i = 0; i < initdb_lines.length; i++) {
                    let line = initdb_lines[i].trim();
                    if (i === initdb_lines.length - 1) {
                        db.run(line, resolve);
                    } else {
                        db.run(line);
                    }
                }
            });

        }));
    } else {  // === 'mysql'

        var drop_tabs = [];

        return (new Promise(function (resolve, reject) {
            db.query('SHOW TABLES', function (err, rows) {
                assert.ifError(err);

                logger.debug(rows);
                for (let i = 0; i < rows.length; i++) {
                    drop_tabs[drop_tabs.length] = ('DROP TABLE '
                                                   + rows[i].Tables_in_Tekuma_artworkdb);
                    logger.debug('Found table:', rows[i].Tables_in_Tekuma_artworkdb);
                }

                resolve();
            });
        })).then(function () {

            var promises_of_deletion = [];
            for (let k = 0; k < drop_tabs.length; k++) {
                logger.debug(drop_tabs[k]);
                promises_of_deletion[promises_of_deletion.length] = (new Promise(function (resolve, reject) {
                    db.query(drop_tabs[k],
                             function (err) {
                                 assert.ifError(err);
                                 resolve();
                             });
                }));
            }
            return Promise.all(promises_of_deletion).then(function () {

                var promises_of_creation = [];

                const initdb = fs.readFileSync('conf/initdb.sql',
                                               {encoding: 'utf-8'});
                let initdb_create_tables = initdb.split('\n');
                for (let j = 0; j < initdb_create_tables.length; j++) {
                    let cmd = initdb_create_tables[j].trim();
                    if (cmd.length === 0)
                        continue;
                    if (cmd.startsWith('CREATE') || cmd.startsWith('create')) {
                        cmd += ' ENGINE=InnoDB DEFAULT CHARSET=utf8';
                    }
                    logger.debug(cmd);
                    promises_of_creation[promises_of_creation.length] = (new Promise(function (resolve, reject) {
                        db.query(cmd,
                                 function (err) {
                                     assert.ifError(err);
                                     resolve();
                                 });
                    }));
                }
                return Promise.all(promises_of_creation);
            });
        });
    }
}

exports.disconnectdb = () => {
    if (db_provider === 'mysql') {
        db.end();
    } else {  // === 'sqlite'
        db.close();
    }
}

// If `uid` of `label` is given, use it.
// Else, generate one.
//
// If try_use_existing is true, then use an existing label if one is
// found that matches the given `val`, `labeltype`, and `origin`.
// `uid`, if given, is ignored if a match is found and
// try_use_existing is true.
//
// If try_use_existing is true but no match is found, then a new label
// is created.
//
// This function does not check for an existing association that is
// essentially similar to the given label. But it should, to avoid
// superfluous associations, i.e., multiple rows in the associations
// table that match the same object and label.
exports.apply_label = (artwork_uid, label, try_use_existing) => {
    var label_uid = label.uid || null;
    var label_origin = label.origin || null;

    return new Promise(function (resolve, reject) {
        var add_assoc = (function (err) {
            var sql_template = 'INSERT INTO associations ' +
                '(label_uid, object_uid, object_table) VALUES (?, ?, "artworks")';
            var qelems = [label_uid,
                          artwork_uid];
            db.query(sql_template, qelems, function (err) {
                assert.ifError(err);
                db.commit(function (err) {
                    assert.ifError(err);
                    resolve();
                });
            });
        });
        db.beginTransaction(function (err) {
            assert.ifError(err);
            var insert_label = (function (err) {
                logger.debug('Inserting new label:', [label_uid, label.val, label.type, label_origin]);
                db.query('INSERT INTO labels ' +
                         '(uid, val, labeltype, origin) ' +
                         'VALUES (?, ?, ?, ?)',
                         [label_uid,
                          label.val,
                          label.type,
                          label_origin],
                         add_assoc);
            });

            if (try_use_existing) {
                logger.debug('Checking for matching label of ',
                             {val: label.val, labeltype: label.type, origin: label_origin});
                db.query('SELECT uid, val, labeltype, origin ' +
                         'FROM labels ' +
                         'WHERE (val = ?) AND (labeltype = ?) AND (origin = ?)',
                         [label.val, label.type, label_origin],
                         function (err, rows) {
                             if (rows.length === 0) {
                                 if (label_uid === null) {
                                     label_uid = uuid.v4();
                                 }
                                 insert_label();
                             } else {
                                 logger.debug('Found existing label match:', rows[0]);
                                 label_uid = rows[0].uid;
                                 add_assoc();
                             }
                         });
            } else {
                if (label_uid === null) {
                    label_uid = uuid.v4();
                }
                insert_label();
            }
        });
    });
}

// `label` has similar form as argument `label` of apply_label().
// However, `uid` is ignored here because it is not relevant.
exports.consolidate_label = (label) => {
    var label_origin = label.origin || null;
    logger.debug('Consolidating label:',
                 {val: label.val, labeltype: label.type, origin: label_origin});
    return dbq('SELECT uid, val, labeltype, origin FROM labels ' +
               'WHERE (val = ?) AND (labeltype = ?) AND (origin = ?)',
               [label.val, label.type, label_origin],
               true).then(function (rows) {
                   var re_assoc = [dbq('DELETE FROM labels WHERE (uid != ?) ' +
                                       'AND (val = ?) AND (labeltype = ?) AND (origin = ?)',
                                       [rows[0].uid, label.val, label.type, label_origin],
                                       false)];
                   re_assoc = re_assoc.concat(rows.slice(1).map(row => {
                       return dbq('UPDATE associations SET label_uid = ? WHERE label_uid = ?',
                                  [rows[0].uid, row.uid],
                                  false);
                   }));
                   return Promise.all(re_assoc);
               });
}

exports.consolidate_all_labels = () => {
    return dbq('SELECT DISTINCT val, labeltype, origin FROM labels', [], true).then(
        function (rows) {
            return Promise.all(rows.map(row => {
                return exports.consolidate_label({
                    val: row.val,
                    type: row.labeltype,
                    origin: row.origin
                });
            }));
        }
    );
}

exports.insert_artwork = (artwork) => {
    var sql_template = 'INSERT INTO artworks (uid, title, artist_uid, thumbnail_url) VALUES (?, ?, ?, ?)';
    var qelems = [artwork.uid,
                  artwork.title,
                  artwork.artist_uid || null,
                  artwork.thumbnail_url || null];
    return dbq(sql_template, qelems, false);
}

exports.insert_artworks = (artworks) => {
    var promises = [];
    for (let i = 0; i < artworks.length; i++) {
        promises[i] = exports.insert_artwork(artworks[i]);
    }
    return Promise.all(promises);
}

exports.insert_artist = (artist) => {
    var sql_template = 'INSERT INTO artists (uid, artist, human_name) VALUES (?, ?, ?)';
    var qelems = [artist.uid,
                  artist.artist,
                  artist.human_name];
    return dbq(sql_template, qelems, false);
}

exports.insert_artists = (artists) => {
    var promises = [];
    for (let i = 0; i < artists.length; i++) {
        promises[i] = exports.insert_artist(artists[i]);
    }
    return Promise.all(promises);
}


exports.get_detail = (artwork_uid) => {
    if (artwork_uid) {

        logger.debug('Received request for detail of artwork:', artwork_uid);

        var sql_template = 'SELECT ' +
            'uid, title, artist_uid, description, thumbnail_url ' +
            'FROM `artworks` ' +
            'WHERE uid = ?';
        var qelems = [artwork_uid];

        return dbq(sql_template, qelems).then(function (rows) {

            // Return a separate promise to allow for further data
            // processing before the caller receives it.
            return new Promise(function (resolve, reject) {

                if (rows.length === 0) {
                    resolve( {uid: artwork_uid, found: false} );
                }

                let row = rows[0];
                resolve({
                    found: true,
                    uid: row.uid,
                    title: row.title,
                    description: row.description,
                    thumbnail512_url: exports.get_othersize(row.thumbnail_url, 512)
                });

            });

        });

    } else {
        return null;
    }
}


// USAGE: q( query, fields )
//
// `query` is a general search string
//
// `fields` (optional) is an object with keys that correspond to
//  particular columns to search or functions thereof.
exports.q = (query, fields) => {
    if (query)
        logger.debug('Received search query:', query);
    if (fields)
        logger.debug('Received search fields:', fields);
    if (query === '' && !fields) {

        throw new Error('Empty search queries are not permitted.');

    } else if (query || fields) {
        if (!query)
            query = '';
        if (!fields)
            fields = {};

        var artworks_direct;
        var artists_direct;

        if (query === '' && fields.title === undefined) {
            artworks_direct = new Promise(function(resolve, reject) { resolve([]); });
        } else {
            let qelems = ['%'+query+'%'];
            let sql_template = 'SELECT ' +
                'uid, title, artist_uid, description, origin, thumbnail_url ' +
                'FROM `artworks` ' +
                'WHERE LOWER(`title`) LIKE ?';
            if (fields.title) {
                sql_template += ' AND LOWER(`title`) LIKE ?';
                qelems[qelems.length] = '%'+fields.title+'%';
            }
            artworks_direct = dbq(sql_template, qelems);
        }

        if (query === '' && fields.artist === undefined) {
            artists_direct = new Promise(function(resolve, reject) { resolve([]); });
        } else {
            let qelems = ['%'+query+'%', '%'+query+'%'];
            let sql_template = 'SELECT uid, artist ' +
                'FROM artists ' +
                'WHERE (LOWER(artist) LIKE ? OR LOWER(human_name) LIKE ?)';
            if (fields.artist) {
                if (query === '') {
                    sql_template += ' AND '
                } else {
                    sql_template += ' OR ';
                }
                sql_template += '(LOWER(artist) LIKE ? OR LOWER(human_name) LIKE ?)';
                qelems[qelems.length] = '%'+fields.artist+'%';
                qelems[qelems.length] = '%'+fields.artist+'%';
            }
            artists_direct = dbq(sql_template, qelems).then(function (rows) {
                if (rows.length === 0) {
                    return (new Promise( function (resolve, reject) {
                        resolve(rows);
                    }));
                }

                var uid_exprs = rows.map((row) => 'artist_uid = \''+String(row.uid) + '\'');

                var qelems = [];
                var sql_template = 'SELECT ' +
                    'uid, title, artist_uid, description, origin, thumbnail_url ' +
                    'FROM `artworks` ' +
                    'WHERE (' + uid_exprs.join(' OR ') + ')';
                if (fields.title) {
                    sql_template += ' AND LOWER(`title`) LIKE ?';
                    qelems[qelems.length] = '%'+fields.title+'%';
                }

                return dbq(sql_template, qelems)
            });
        }

        return Promise.all([artworks_direct, artists_direct]).then(function (qrows) {
            var rows = qrows[0];

            // If used search field that constrains which artist names are
            // matches, then prune other lists to only those artist matches.
            if (fields.artist) {
                let req_artist_uids = qrows[1].map(row => row.artist_uid);
                let current_index = 0;
                while (current_index < rows.length) {

                    if (!req_artist_uids.includes(rows[current_index].artist_uid)) {
                        rows.splice(current_index, 1);
                        continue;
                    }

                    current_index++;
                }
            }

            var row_uids = rows.map(row => row.uid);
            for (let i = 0; i < qrows[1].length; i++) {
                if (!row_uids.includes(qrows[1][i].uid)) {
                    rows[rows.length] = qrows[1][i];
                }
            }

            var promises = [];
            for (let i = 0; i < rows.length; i++) {
                promises[promises.length] = (new Promise(function (resolve, reject) {
                    var ex = rows[i].artist_uid;
                    var sql_template = 'SELECT uid, artist ' +
                        'FROM artists WHERE uid = ?';
                    if (db_provider === 'mysql') {
                    db.query(sql_template, [ex],
                             function (err, artist_rows) {
                                 if (err) throw err;
                                 resolve(artist_rows[0]);
                             });
                    } else {
                        db.all(sql_template, [ex],
                               function (err, artist_rows) {
                                   if (err) throw err;
                                   resolve(artist_rows);
                               });
                    }
                }));
            }
            return Promise.all(promises).then(function (artist_rows) {

                let artists = {};
                for (let j = 0; j < artist_rows.length; j++) {
                    artists[artist_rows[j].uid] = artist_rows[j].artist;
                }
                for (let j = 0; j < rows.length; j++) {
                    if (rows[j].artist === undefined) {
                        rows[j].artist = artists[rows[j].artist_uid];
                    }
                }

                return (new Promise(function (resolve, reject) {
                    resolve(rows);
                }));

            });


        });

    } else {
        return null;
    }
}
