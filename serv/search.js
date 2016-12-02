// artworks search server - routines for searching, db connection
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston


const assert = require('assert');
const fs = require('fs');

const bunyan = require('bunyan');
var logger = bunyan.createLogger({
    name: 'serv/search',
    level: 'warn'
});


var db_provider
var db;
var db_config;

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
            dbconf.ssl.ca = fs.readFileSync(__dirname + '/cert/' + dbconf.ssl.ca);
            dbconf.ssl.cert = fs.readFileSync(__dirname + '/cert/' + dbconf.ssl.cert);
            dbconf.ssl.key = fs.readFileSync(__dirname + '/cert/' + dbconf.ssl.key);
        }
        dbconf.charset = 'utf8';
        db = mysql.createConnection(dbconf);
        db.connect();
        logger.info('Connected to MySQL database.');

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
        return (new Promise(function(resolve, reject) {

            const mysql = require('mysql');

            var multi_db_config = Object.create(db_config);
            multi_db_config.multipleStatements = true;

            const multi_db = mysql.createConnection(multi_db_config);
            multi_db.connect();

            multi_db.query('SHOW TABLES', function (err, rows) {
                assert.ifError(err);
                var dropcreate = '';
                for (let i = 0; i < rows.length; i++) {
                    dropcreate += ('DROP TABLE '
                                   + rows[i].Tables_in_Tekuma_artworkdb + ';');
                }

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
                    dropcreate += cmd +';\n';
                }

                multi_db.query(dropcreate,
                               function (err) {
                                   assert.ifError(err);
                                   multi_db.end(function (err) {
                                       assert.ifError(err);
                                       resolve();
                                   });
                               });
            });

        }));
    }
}

exports.disconnectdb = () => {
    if (db_provider === 'mysql') {
        db.end();
    } else {  // === 'sqlite'
        db.close();
    }
}

exports.insert_artwork = (artwork) => {
    if (db_provider === 'mysql') {

        return (new Promise(function(resolve, reject) {
            db.query('INSERT INTO artworks (uid, title, artist_uid, thumbnail_url) VALUES (?, ?, ?, ?)',
                     [artwork.uid,
                      artwork.title,
                      artwork.artist_uid || null,
                      artwork.thumbnail_url || null],
                     function (err) {
                         if (err) throw err;
                         resolve();
                     });
        }));

    } else {  // === 'sqlite'

        return (new Promise(function(resolve, reject) {
            db.run('INSERT INTO artworks (uid, title, artist_uid, thumbnail_url) VALUES (?, ?, ?, ?)',
                     [artwork.uid,
                      artwork.title,
                      artwork.artist_uid || null,
                      artwork.thumbnail_url || null],
                     function (err) {
                         if (err) throw err;
                         resolve();
                     });
        }));

    }
}

exports.insert_artworks = (artworks) => {
    var promises = [];
    for (let i = 0; i < artworks.length; i++) {
        promises[i] = exports.insert_artwork(artworks[i]);
    }
    return Promise.all(promises);
}

exports.insert_artist = (artist) => {
    if (db_provider === 'mysql') {

        return (new Promise(function(resolve, reject) {
            db.query('INSERT INTO artists (uid, artist, human_name) VALUES (?, ?, ?)',
                     [artist.uid,
                      artist.artist,
                      artist.human_name],
                     function (err) {
                         if (err) throw err;
                         resolve();
                     });
        }));

    } else {  // === 'sqlite'

        return (new Promise(function(resolve, reject) {
            db.run('INSERT INTO artists (uid, artist, human_name) VALUES (?, ?, ?)',
                   [artist.uid,
                    artist.artist,
                    artist.human_name],
                   function (err) {
                       if (err) throw err;
                       resolve();
                   });
        }));

    }
}

exports.insert_artists = (artists) => {
    var promises = [];
    for (let i = 0; i < artists.length; i++) {
        promises[i] = exports.insert_artist(artists[i]);
    }
    return Promise.all(promises);
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
            artworks_direct = new Promise(function(resolve, reject) {
                var qelems = ['%'+query+'%'];
                var sql_template = 'SELECT ' +
                    'uid, title, artist_uid, description, origin, thumbnail_url ' +
                    'FROM `artworks` ' +
                    'WHERE LOWER(`title`) LIKE ?';
                if (fields.title) {
                    sql_template += ' AND LOWER(`title`) LIKE ?';
                    qelems[qelems.length] = '%'+fields.title+'%';
                }

                if (db_provider === 'mysql') {
                    db.query(sql_template,
                             qelems,
                             function (err, rows, fields) {
                                 if (err) throw err;
                                 resolve(rows);
                             });
                } else {
                    db.all(sql_template,
                           qelems,
                           function (err, rows, fields) {
                               if (err) throw err;
                               resolve(rows);
                           });
                }
            });
        }

        if (query === '' && fields.artist === undefined) {
            artists_direct = new Promise(function(resolve, reject) { resolve([]); });
        } else {
            artists_direct = (new Promise(function(resolve, reject) {
                var qelems = ['%'+query+'%', '%'+query+'%'];
                var sql_template = 'SELECT uid, artist ' +
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

                if (db_provider === 'mysql') {
                    db.query(sql_template,
                             qelems,
                             function (err, rows, fields) {
                                 if (err) throw err;
                                 resolve(rows);
                             });
                } else {
                    db.all(sql_template,
                           qelems,
                           function (err, rows, fields) {
                               if (err) throw err;
                               resolve(rows);
                           });
                }
            })).then(function (rows) {
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

                return (new Promise(function (resolve, reject) {
                    if (db_provider === 'mysql') {
                        db.query(sql_template,
                                 qelems,
                                 function (err, rows, fields) {
                                     if (err) throw err;
                                     resolve(rows);
                                 });
                    } else {
                        db.all(sql_template,
                               qelems,
                               function (err, rows, fields) {
                                   if (err) throw err;
                                   resolve(rows);
                               });
                    }
                }));
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
                    db.query(sql_template,
                             [ex],
                             function (err, artist_rows) {
                                 if (err) throw err;
                                 resolve(artist_rows[0]);
                             });
                    } else {
                        db.all(sql_template,
                               [ex],
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
