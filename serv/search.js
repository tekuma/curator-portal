// artworks search server - routines for searching, db connection
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston


const assert = require('assert');
const fs = require('fs');

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
        console.log('Connected to SQLite in-memory database.');

    } else if (provider.toLowerCase() === 'mysql') {
        provider = 'mysql';  // Normalize provider name

        const mysql = require('mysql');
        if (dbconf.ssl) {
            dbconf.ssl.ca = fs.readFileSync(__dirname + '/cert/' + dbconf.ssl.ca);
            dbconf.ssl.cert = fs.readFileSync(__dirname + '/cert/' + dbconf.ssl.cert);
            dbconf.ssl.key = fs.readFileSync(__dirname + '/cert/' + dbconf.ssl.key);
        }
        db = mysql.createConnection(dbconf);
        db.connect();
        console.log('Connected to MySQL database.');

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
                dropcreate += initdb.split('\n').join('; ') + ';';

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


exports.q = (query) => {
    console.log('Received search query:', query);
    if (query === '') {

        throw new Error('Empty search queries are not permitted.');

    } else if (query) {

        artworks_direct = new Promise(function(resolve, reject) {
            var ex = '%'+query+'%';
            var sql_template = 'SELECT ' +
                'uid, title, artist_uid, description, origin, thumbnail_url ' +
                'FROM `artworks` ' +
                'WHERE LOWER(`title`) LIKE ?';

            if (db_provider === 'mysql') {
                db.query(sql_template,
                         [ex],
                         function (err, rows, fields) {
                             if (err) throw err;
                             resolve(rows);
                         });
            } else {
                db.all(sql_template,
                     [ex],
                     function (err, rows, fields) {
                         if (err) throw err;
                         resolve(rows);
                     });
            }
        });
        artists_direct = (new Promise(function(resolve, reject) {
            var ex = '%'+query+'%';
            var sql_template = 'SELECT uid, artist ' +
                'FROM artists ' +
                'WHERE LOWER(artist) LIKE ? OR LOWER(human_name) LIKE ?';

            if (db_provider === 'mysql') {
                db.query(sql_template,
                         [ex, ex],
                         function (err, rows, fields) {
                             if (err) throw err;
                             resolve(rows);
                         });
            } else {
                db.all(sql_template,
                       [ex, ex],
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

            var ex = '%'+query+'%';
            var sql_template = 'SELECT ' +
                'uid, title, artist_uid, description, origin, thumbnail_url ' +
                'FROM `artworks` ' +
                'WHERE ' + uid_exprs.join(' OR ')

            return (new Promise(function (resolve, reject) {
                if (db_provider === 'mysql') {
                    db.query(sql_template,
                             function (err, rows, fields) {
                                 if (err) throw err;
                                 resolve(rows);
                             });
                } else {
                    db.all(sql_template,
                           function (err, rows, fields) {
                               if (err) throw err;
                               resolve(rows);
                           });
                }
            }));
        });

        return Promise.all([artworks_direct, artists_direct]).then(function (qrows) {
            var rows = qrows[0];
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
