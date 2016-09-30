// artworks search server
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston

var fs = require('fs');

var https = require('https');
var express = require('express');
var app = express();

var helmet = require('helmet');
app.use(helmet());

var mysql = require('mysql');

var dbconf = require('../tests/testdbconf.json');
var db = mysql.createConnection({
    host: dbconf.host,
//    ssl: {
//      ca: fs.readFileSync(__dirname + '/cert/sql-server-ca.pem'),
//      cert: fs.readFileSync(__dirname + '/cert/sql-client-cert.pem'),
//      key: fs.readFileSync(__dirname + '/cert/sql-client-key.pem')
//    },
    user: dbconf.user,
    password: dbconf.password,
    database: dbconf.database
});

db.connect();

app.get('/search', function (req, res) {
    var restext = '<!DOCTYPE html><html><head></head><body>';
    if (req.query.q) {
        var query = '%'+req.query.q+'%';
        db.query('SELECT * FROM `artworks` WHERE LOWER(`artist`) LIKE ? OR LOWER(`title`) LIKE ?',
               [query, query],
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

https.createServer({ciphers:'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256',
                    honorCipherOrder: true,
                    key: fs.readFileSync(__dirname + '/../tests/cert/selfsigned.key'),
                    cert: fs.readFileSync(__dirname + '/../tests/cert/selfsigned.crt'),
                    ca: [fs.readFileSync(__dirname + '/../tests/cert/selfsigned.csr')]
		   }, app).listen(3030);
