// artworks search server - routines for searching, db connection
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston


var fs = require('fs');
var db_provider
var db;

exports.connectdb = (dbconf, provider) => {
    if (typeof provider === 'undefined') {
        provider = 'mysql';
    }

    if (provider.toLowerCase() === 'sqlite'
        || provider.toLowerCase() === 'sqlite3') {
        provider = 'sqlite';  // Normalize provider name

        var sqlite3 = require('sqlite3');
        db = new sqlite3.Database(':memory:');

    } else if (provider.toLowerCase() === 'mysql') {
        provider = 'mysql';  // Normalize provider name

        var mysql = require('mysql');
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
    return db;
}

exports.provider = () => {
    return db_provider;
}

exports.disconnectdb = () => {
    if (db_provider === 'mysql') {
        db.end();
    } else {  // === 'sqlite'
        db.close();
    }
}

exports.q = (query) => {
    console.log('Received search query:', query);
    if (query) {
        if (db_provider === 'mysql') {
            var query_method = db.query;
        } else {  // === 'sqlite'
            var query_method = db.all;
        }
        return (new Promise(function(resolve, reject) {
            var ex = '%'+query+'%';
            var sql_template = 'SELECT ' +
                'artist, title, description, tags, origin, thumbnail_url ' +
                'FROM `artworks` ' +
                'WHERE LOWER(`artist`) LIKE ? OR LOWER(`title`) LIKE ?';

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
        }));
    } else {
        return null;
    }
}
