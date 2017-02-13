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

function start_transaction(fcn) {
    if (db_provider === 'mysql') {
        return db.beginTransaction(fcn);
    } else {  // === 'sqlite'
        //db.all('BEGIN TRANSACTION', [], fcn);
        fcn();
    }
}

function commit_transaction(fcn) {
    if (db_provider === 'mysql') {
        return db.commit(fcn);
    } else {  // === 'sqlite'
        //db.all('COMMIT TRANSACTION', [], fcn);
        fcn();
    }
}


// Input is string following the schema for several types of labels
// about colors, as described in databases.md in the documentation repo.
// E.g., "#9aa0a9 0.3855" or "#9aa0a9"
//
// Return pair [RGB, density], where RGB is a triple of integers each
// in the interval 0..255, and where density is floating point
// density value if one is found; otherwise, null. Return null if error.
exports.parse_color_label = (color_label_string) => {
    var rgb_offset = 0;
    if (color_label_string[0] === '#') {
        rgb_offset = 1;
    } else if (color_label_string[0] === '0' && color_label_string[1] === 'x') {
        rgb_offset = 2;
    }
    var rgb = [
        Number('0x'+color_label_string.slice(rgb_offset, rgb_offset+2)),
        Number('0x'+color_label_string.slice(rgb_offset+2, rgb_offset+4)),
        Number('0x'+color_label_string.slice(rgb_offset+4, rgb_offset+6))
    ];
    if (color_label_string.length > rgb_offset+6) {
        var density = Number(color_label_string.slice(rgb_offset+6));
    } else {
        var density = null;
    }
    return [rgb, density];
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
        db.end(function (err) { assert.ifError(err); });
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
exports.apply_label = (artwork_uid, label, try_use_existing) => {
    var label_uid = label.uid || null;
    var label_origin = label.origin || null;

    return new Promise(function (resolve, reject) {
        var add_assoc = (function (err) {
            dbq('SELECT label_uid FROM associations WHERE (label_uid = ?) AND (object_uid = ?) AND (object_table = ?)',
                [label_uid,
                 artwork_uid,
                 "artworks"]).then(function (rows) {
                     if (rows.length > 0) {
                         resolve();
                     } else {
                         var sql_template = 'INSERT INTO associations ' +
                             '(label_uid, object_uid, object_table) VALUES (?, ?, "artworks")';
                         var qelems = [label_uid,
                                       artwork_uid];
                         dbq(sql_template, qelems, false).then(resolve);
                     }
                 });
        });
        var insert_label = (function (err) {
            logger.debug('Inserting new label:', [label_uid, label.val, label.type, label_origin]);
            dbq('INSERT INTO labels ' +
                '(uid, val, labeltype, origin) ' +
                'VALUES (?, ?, ?, ?)',
                [label_uid,
                 label.val,
                 label.type,
                 label_origin],
                false).then(add_assoc);
        });

        if (try_use_existing) {
            logger.debug('Checking for matching label of ',
                         {val: label.val, labeltype: label.type, origin: label_origin});
            dbq('SELECT uid, val, labeltype, origin ' +
                'FROM labels ' +
                'WHERE (val = ?) AND (labeltype = ?) AND (origin = ?)',
                [label.val, label.type, label_origin]).then(function (rows) {
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

// If update is false (default), then INSERT the given artwork entry
// without checking for existing conflicting uid.  If update is true,
// check whether there is row with given uid, and then, UPDATE or
// INSERT accordingly.
exports.insert_artwork = (artwork, update) => {
    update = update || false;
    var new_insert = (function () {
        return dbq('INSERT INTO artworks (uid, title, description, artist_uid, thumbnail_url) VALUES (?, ?, ?, ?, ?)',
                   [artwork.uid,
                    artwork.title,
                    artwork.description || null,
                    artwork.artist_uid || null,
                    artwork.thumbnail_url || null], false);
    });
    if (update) {
        return new Promise(function (resolve, reject) {
            dbq('SELECT uid FROM artworks WHERE uid = ?', [artwork.uid]).then(
                function (rows) {
                    if (rows.length === 0) {
                        return new_insert();
                    } else {
                        return dbq('UPDATE artworks SET title = ?, description = ?, artist_uid = ?, thumbnail_url = ? WHERE uid = ?',
                                   [artwork.title,
                                    artwork.description || null,
                                    artwork.artist_uid || null,
                                    artwork.thumbnail_url || null,
                                    artwork.uid], false).then(resolve);
                    }
                });
        });
    } else {
        return new_insert();
    }
}

// `update` parameter here has same interpretation as that of insert_artwork()
// except that it is applied to all artworks.
exports.insert_artworks = (artworks, update) => {
    var promises = [];
    for (let i = 0; i < artworks.length; i++) {
        promises[i] = exports.insert_artwork(artworks[i], update);
    }
    return Promise.all(promises);
}

// `update` parameter here has same interpretation as that of insert_artwork()
exports.insert_artist = (artist, update) => {
    update = update || false;
    var new_insert = (function () {
        return dbq('INSERT INTO artists (uid, artist, human_name) VALUES (?, ?, ?)',
                   [artist.uid,
                    artist.artist,
                    artist.human_name], false);
    });
    if (update) {
        return new Promise(function (resolve, reject) {
            dbq('SELECT uid FROM artists WHERE uid = ?', [artist.uid]).then(
                function (rows) {
                    if (rows.length === 0) {
                        return new_insert();
                    } else {
                        return dbq('UPDATE artists SET artist = ?, human_name = ? WHERE uid = ?',
                                   [artist.artist,
                                    artist.human_name,
                                    artist.uid], false).then(resolve);
                    }
                });
        });
    } else {
        return new_insert();
    }
}

// `update` parameter here has same interpretation as that of insert_artwork()
// except that it is applied to all artists.
exports.insert_artists = (artists, update) => {
    var promises = [];
    for (let i = 0; i < artists.length; i++) {
        promises[i] = exports.insert_artist(artists[i], update);
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

        return new Promise(function (resolve, reject) {
            dbq(sql_template, qelems).then(function (rows) {
                if (rows.length === 0) {
                    resolve({uid: artwork_uid, found: false});
                } else {
                    let row = rows[0];
                    var details = {
                        found: true,
                        uid: row.uid,
                        title: row.title,
                        description: row.description,
                        thumbnail512_url: exports.get_othersize(row.thumbnail_url, 512),
                        tags: {w3c_rgb_colors: [], labels: []}
                    };
                    dbq('SELECT label_uid FROM associations WHERE (object_table = "artworks") AND (object_uid = ?)',
                        [details.uid]).then(function (rows) {
                            var label_ps = rows.map(row => {
                                return dbq('SELECT labeltype, val FROM labels WHERE (labeltype = "clarifai-text-tag" OR labeltype = "clarifai-w3c-color-density") AND (uid = ?)',
                                           [row.label_uid]);
                            });
                            return Promise.all(label_ps).then(function (labels_rows) {
                                var labels = [];
                                for (let j = 0; j < labels_rows.length; j++) {
                                    if (labels_rows[j].length > 0) {
                                        labels[labels.length] = [labels_rows[j][0].labeltype, labels_rows[j][0].val];
                                    }
                                }
                                return labels;
                            });
                        }).then(function (labels) {
                            details.tags = {labels: [], w3c_rgb_colors: []};
                            for (let j = 0; j < labels.length; j++) {
                                if (labels[j][0] === 'clarifai-text-tag') {
                                    details.tags.labels[details.tags.labels.length] = labels[j][1];
                                } else {  // labels[j][0] === 'clarifai-w3c-color-density'
                                    details.tags.w3c_rgb_colors[details.tags.w3c_rgb_colors.length] =
                                        exports.parse_color_label(labels[j][1])[0];
                                }
                            }
                            resolve(details);
                        });
                }
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
        var labels_direct;

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
            artists_direct = new Promise(function (resolve, reject) { resolve([]); });
        } else {
            artists_direct = new Promise(function (resolve, reject) {
                var qelems = ['%'+query+'%', '%'+query+'%'];
                var sql_template = 'SELECT uid, artist ' +
                    'FROM artists ' +
                    'WHERE (LOWER(artist) LIKE ? OR LOWER(human_name) LIKE ?)';
                if (fields.artist) {
                    if (query === '') {
                        sql_template += ' AND ';
                    } else {
                        sql_template += ' OR ';
                    }
                    sql_template += '(LOWER(artist) LIKE ? OR LOWER(human_name) LIKE ?)';
                    qelems[qelems.length] = '%'+fields.artist+'%';
                    qelems[qelems.length] = '%'+fields.artist+'%';
                }
                dbq(sql_template, qelems).then(function (rows) {
                    if (rows.length === 0) {
                        resolve([]);
                        return;
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

                    dbq(sql_template, qelems).then(function (rows) {
                        resolve(rows);
                    });
                });
            });
        }

        if (query === '' && fields.text_tag_list === undefined) {
            labels_direct = new Promise(function(resolve, reject) { resolve([]); });
        } else {
            // SELECT object_uid FROM associations WHERE (object_table = "artworks") AND (label_uid = "822ab8b1-6997-4eba-addf-10c3667c1791" OR label_uid = "693a04ad-f013-45e0-b2a4-41fbd860b3f3");
            labels_direct = new Promise(function (resolve, reject) {
                var qelems = [];
                var sql_template = 'SELECT uid ' +
                    'FROM labels ' +
                    'WHERE (labeltype = "clarifai-text-tag") AND (';
                if (query !== '') {
                    sql_template += 'LOWER(val) LIKE ?';
                    qelems[qelems.length] = '%'+query+'%';
                }
                if (fields.text_tag_list) {
                    for (let j = 0; j < fields.text_tag_list.length; j++) {
                        if (j > 0 || query !== '') {
                            sql_template += ' OR ';
                        }
                        sql_template += 'LOWER(val) LIKE ?';
                        qelems[qelems.length] = '%'+fields.text_tag_list[j].text+'%';
                    }
                }
                sql_template += ')';
                dbq(sql_template, qelems).then(function (rows) {
                    if (rows.length === 0) {
                        resolve([]);
                        return;
                    }

                    var uid_exprs = rows.map((row) => 'label_uid = \''+String(row.uid) + '\'');
                    var qelems = [];
                    var sql_template = 'SELECT DISTINCT ' +
                        'object_uid ' +
                        'FROM associations ' +
                        'WHERE (' + uid_exprs.join(' OR ') + ')';
                    dbq(sql_template, qelems).then(function (rows) {
                        if (rows.length === 0) {
                            resolve([]);
                            return;
                        }

                        var uid_exprs = rows.map((row) => 'uid = \''+String(row.object_uid) + '\'');

                        var qelems = [];
                        var sql_template = 'SELECT ' +
                            'uid, title, artist_uid, description, origin, thumbnail_url ' +
                            'FROM `artworks` ' +
                            'WHERE (' + uid_exprs.join(' OR ') + ')';

                        dbq(sql_template, qelems).then(function (rows) {
                            resolve(rows);
                        });
                    });
                });
            });
        }

        return Promise.all([artworks_direct, artists_direct, labels_direct]).then(function (qrows) {
            var rows = qrows[0];
            for (let j = 0; j < qrows[2].length; j++) {
                let found_match = false;
                for (let k = 0; k < rows.length; k++) {
                    if (rows[k].uid === qrows[2][j].uid) {
                        found_match = true;
                        break;
                    }
                }
                if (!found_match) {
                    rows[rows.length] = qrows[2][j];
                }
            }

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
                                     if (artist_rows.length > 0) {
                                         resolve(artist_rows[0]);
                                     } else {
                                         // This case should only occur when there are inconsistencies among
                                         // tables, which should be handled somewhere else.
                                         resolve([]);
                                     }
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
