// artworks search server
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston

var firebase = require('firebase');
firebase.initializeApp({
    databaseURL: "https://curator-tekuma.firebaseio.com",
    serviceAccount: require('./cert/curator-tekuma.json')
});

var fs = require('fs');

var https = require('https');
var express = require('express');
var app = express();

var helmet = require('helmet');
app.use(helmet());

var mysql = require('mysql');

var dbconf = require('../tests/testdbconf.json');
if (dbconf.ssl) {
    dbconf.ssl.ca = fs.readFileSync(__dirname + '/cert/' + dbconf.ssl.ca);
    dbconf.ssl.cert = fs.readFileSync(__dirname + '/cert/' + dbconf.ssl.cert);
    dbconf.ssl.key = fs.readFileSync(__dirname + '/cert/' + dbconf.ssl.key);
}
var db = mysql.createConnection(dbconf);
db.connect();

app.get('/search', function (req, res) {
    if (!req.query.auth) {
        res.send('access denied.');
        return;
    } else {

        firebase.auth().verifyIdToken(req.query.auth).then(function(decodedToken) {

            if (req.query.q) {
                var query = '%'+req.query.q+'%';
                db.query('SELECT * FROM `artworks` WHERE LOWER(`artist`) LIKE ? OR LOWER(`title`) LIKE ?',
                         [query, query],
                         function (err, rows, fields) {
                             if (err) throw err;
                             res.json({rows: rows})
                         });
            } else {
                res.json({rows: null});
            }

        }).catch(function(error) {
            console.log('firebase auth failed with error: ', error);
            res.send('access denied.');
        });

    }
});

app.use('/', express.static('build'));


https.createServer({ciphers:'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256',
                    honorCipherOrder: true,
                    key: fs.readFileSync(__dirname + '/../tests/cert/selfsigned.key'),
                    cert: fs.readFileSync(__dirname + '/../tests/cert/selfsigned.crt'),
                    ca: [fs.readFileSync(__dirname + '/../tests/cert/selfsigned.csr')]
                   }, app).listen(3030);
