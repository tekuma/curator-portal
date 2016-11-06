// artworks search server - main entry point
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston

var cmd_q_string = null;
var verbose = false;
for (let i = 1; i < process.argv.length; i++) {
    if (process.argv[i] === '-h'
        || process.argv[i] === '--help') {
        console.log('Usage: serv/main.js [-h] [-q SEARCH...]');
        process.exit();
    } else if (process.argv[i] == '-v') {
        verbose = true;
    } else if (process.argv[i] == '-q') {
        cmd_q_string = process.argv.slice(i+1).join(' ');
    }
}

const firebase = require('firebase');
firebase.initializeApp({
    databaseURL: "https://curator-tekuma.firebaseio.com",
    serviceAccount: require('./cert/curator-tekuma.json')
});

const fs = require('fs');

const https = require('https');
const express = require('express');
var app = express();

const helmet = require('helmet');
app.use(helmet());

const servconf = require('./server-config.json');
const search = require('./search.js');
const dbconf = require(servconf.artworkdb);
search.connectdb(dbconf);

if (cmd_q_string != null) {

    search.q( cmd_q_string ).then(function(rows) {
        console.log(rows);
        process.exit();

    });

} else {

    app.get('/search', function (req, res) {
        if (!req.query.auth) {
            res.send('access denied.');
            return;
        } else {

            firebase.auth().verifyIdToken(req.query.auth).then(function(decodedToken) {
                search.q( req.query.q ).then(function(rows) {
                    res.json({rows: rows});
                });
            }).catch(function(error) {
                console.log('firebase auth failed with error: ', error);
                res.send('access denied.');
            });

        }
    });


    https.createServer({ciphers:'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256',
                        honorCipherOrder: true,
                        key: fs.readFileSync(__dirname + '/' + servconf.httpscert.key),
                        cert: fs.readFileSync(__dirname + '/' + servconf.httpscert.cert),
                        ca: [fs.readFileSync(__dirname + '/' + servconf.httpscert.ca)]
                       }, app).listen(servconf.port);

}
