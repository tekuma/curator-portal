// artworks search server
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston

var fs = require('fs');

var express = require('express');
var app = express();

var mysql = require('mysql');
var db = mysql.createConnection({
    host: '104.196.127.226',
    ssl: {
      ca: fs.readFileSync(__dirname + '/cert/server-ca.pem'),
      cert: fs.readFileSync(__dirname + '/cert/client-cert.pem'),
      key: fs.readFileSync(__dirname + '/cert/client-key.pem')
    },
    user: 'root',
    password: fs.readFileSync(__dirname + '/cert/root-passwd.txt'),
    database: 'Tekuma_artworkdb'
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

app.listen(3030, function () {
    console.log('Listening on port 3030...');
});
