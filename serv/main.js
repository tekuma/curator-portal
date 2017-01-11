// artworks search server - main entry point
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston

const bunyan = require('bunyan');
var logger = bunyan.createLogger({
    name: 'serv/main',
    level: (process.env.NODE_ENV === 'production' ? 'warn' : 'debug')
});


var cmd_q_string = null;
var cmd_uid_request = null;
var verbose = false;
var use_mockup_firebase = false;
for (let i = 1; i < process.argv.length; i++) {
    if (process.argv[i] === '-h'
        || process.argv[i] === '--help') {
        console.log('Usage: serv/main.js [-h] [--firebase-mockup] [--uid ARTWORK_UID] [-q SEARCH...]');
        process.exit();
    } else if (process.argv[i] === '-v') {
        verbose = true;
    } else if (process.argv[i] === '-q') {
        if (process.argv.length - i < 2) {
            console.log('ERROR: Missing query string. Try `serv/main.js -h`.');
            process.exit(1);
        }
        cmd_q_string = process.argv.slice(i+1).join(' ');
    } else if (process.argv[i] === '--uid') {
        if (process.argv.length - i < 2) {
            console.log('ERROR: Missing query string. Try `serv/main.js -h`.');
            process.exit(1);
        }
        cmd_uid_request = process.argv.slice(i+1, i+2)[0];
    } else if (process.argv[i] === '--firebase-mockup') {
        use_mockup_firebase = true;
    }
}

if (use_mockup_firebase) {
    var firebase_path = 'mock-firebase';
} else {
    var firebase_path = 'firebase';
}
const firebase = require(firebase_path);
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
        console.log('Found', rows.length, 'rows');
        console.log(rows.map(row => {
            return row.uid + ': "' + String(row.title) + '" by ' + String(row.artist);
        }));
        search.disconnectdb();
    });

} else if (cmd_uid_request != null) {

    search.get_detail(cmd_uid_request).then(function(detail) {
        console.log(detail);
        search.disconnectdb();
    });

} else {

    app.get('/search', function (req, res) {
        if (!req.query.auth) {
            res.send('access denied.');
            return;
        } else {
            // Manually extract named search fields from query to
            // resist injection-based attacks.
            fields = {};
            if (req.query.q_title) {
                fields.title = req.query.q_title;
            }
            if (req.query.q_artist) {
                fields.artist = req.query.q_artist;
            }

            firebase.auth().verifyIdToken(req.query.auth).then(function(decodedToken) {
                search.q( req.query.q, fields ).then(function(rows) {
                    res.json({rows: rows});
                });
            }).catch(function(error) {
                logger.error('firebase auth failed with error: ', error);
                res.send('access denied.');
            });

        }
    });

    app.get('/detail', function (req, res) {
        if (!req.query.auth) {
            res.send('access denied.');
            return;
        } else {
            firebase.auth().verifyIdToken(req.query.auth).then(function(decodedToken) {
                search.get_detail( req.query.uid ).then(function(detail) {
                    res.json(detail);
                });
            }).catch(function(error) {
                logger.error('firebase auth failed with error: ', error);
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
