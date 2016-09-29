// artworks search server
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston

var fs = require('fs');

var express = require('express');
var app = express();

var mysql = require('mysql');

var dbconf = require('../tests/testdbconf.json');
var db = mysql.createConnection({
    host: dbconf.host,
//    ssl: {
//      ca: fs.readFileSync(__dirname + '/cert/server-ca.pem'),
//      cert: fs.readFileSync(__dirname + '/cert/client-cert.pem'),
//      key: fs.readFileSync(__dirname + '/cert/client-key.pem')
//    },
    user: dbconf.user,
    password: dbconf.password,
    database: dbconf.database
});

db.connect();

app.get('/search', function (req, res) {
    var restext = '<!DOCTYPE html><html><head></head><body>';
    if (req.query.q) {
        db.query('SELECT * FROM artworks',
	       function (err, rows, fields) {
	         if (err) throw err;
            restext += '<ul>\n';
            rows.forEach(function (row) {
                 restext += '<li>'+JSON.stringify(row)+'</li>\n';
            });
	    restext += '</ul>\n';
	    restext += '</body></html>';
            res.send(restext);
        });
    } else {
        restext += '</body></html>';
        res.send(restext);
    }
});

app.use('/', express.static('build'));

app.listen(3030, function () {
    console.log('Listening on port 3030...');
});
