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
            db.query('INSERT INTO artworks (uid, title) VALUES (?, ?)',
                     [artwork.uid,
                      artwork.title],
                     function (err) {
                         if (err) throw err;
                         resolve();
                     });
        }));

    } else {  // === 'sqlite'

        return (new Promise(function(resolve, reject) {
            db.run('INSERT INTO artworks (uid, title) VALUES (?, ?)',
                     [artwork.uid,
                      artwork.title],
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
    if (query || query === '') {
        return (new Promise(function(resolve, reject) {
            var ex = '%'+query+'%';
            var sql_template = 'SELECT ' +
                'title, description, origin, thumbnail_url ' +
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
        }));
    } else {
        return null;
    }
}
