// artworks search server - routines for searching, db connection
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston


var mysql = require('mysql');
exports.connectdb = (dbconf) => {
    if (dbconf.ssl) {
        dbconf.ssl.ca = fs.readFileSync(__dirname + '/cert/' + dbconf.ssl.ca);
        dbconf.ssl.cert = fs.readFileSync(__dirname + '/cert/' + dbconf.ssl.cert);
        dbconf.ssl.key = fs.readFileSync(__dirname + '/cert/' + dbconf.ssl.key);
    }
    var db = mysql.createConnection(dbconf);
    db.connect();
    console.log('Connected to MySQL database.');
    return db;
}

exports.q = (db, query) => {
    console.log('Received search query:', query);
    if (query) {
        return (new Promise(function(resolve, reject) {
            var ex = '%'+query+'%';
            db.query('SELECT * FROM `artworks` WHERE LOWER(`artist`) LIKE ? OR LOWER(`title`) LIKE ?',
                     [ex, ex],
                     function (err, rows, fields) {
                         if (err) throw err;
                         resolve(rows);
                     });
        }));
    } else {
        return null;
    }
}
