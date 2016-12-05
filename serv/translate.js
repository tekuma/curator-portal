// interface and translation code for importing from other databases.
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston


const assert = require('assert');
const fs = require('fs');

const bunyan = require('bunyan');
var logger = bunyan.createLogger({
    name: 'serv/translate',
    level: (process.env.NODE_ENV === 'production' ? 'warn' : 'debug')
});


exports.translate_from_tekuma_firebase = (filename) => {

    const servconf = require('./server-config.json');
    const search = require('./search.js');
    const dbconf = require(servconf.artworkdb);
    search.connectdb(dbconf);

    var promises = [];

    var raw_db = fs.readFileSync(filename, 'utf8').replace(/\\u/g, '\\\\u').replace(/\\x/g, '\\\\x');
    var firebase_db = JSON.parse(raw_db);
    for (artist_uid in firebase_db) {
        logger.debug('Importing entry for artist UID: ', artist_uid);

        if (firebase_db[artist_uid].artworks === undefined
            || firebase_db[artist_uid].display_name === undefined) {
            logger.debug('Entry for artist UID',
                         artist_uid,
                         'does not have `artworks` or `displayname` fields');
            continue;
        }

        let artworks = [];
        for (artwork in firebase_db[artist_uid].artworks) {
            if (firebase_db[artist_uid].artworks[artwork].id === undefined) {
                logger.warn('Skipping artwork with missing UID by artist ' + artist_uid);
                continue;
            }

            artworks[artworks.length] = {
                uid: firebase_db[artist_uid].artworks[artwork].id,
                title: firebase_db[artist_uid].artworks[artwork].title || '',
                artist_uid: artist_uid,
                thumbnail_url: firebase_db[artist_uid].artworks[artwork].fullsize_url || 'nil',
            };
            logger.debug('Pushing artwork:', artworks[artworks.length-1]);
        }
        if (artworks.length > 0) {
            let artist_row = {
                uid: artist_uid,
                artist: firebase_db[artist_uid].display_name || ''
            };
            promises[promises.length] = search.insert_artist(artist_row);
            logger.debug('Pushing artist:', artist_row);
            promises[promises.length] = search.insert_artworks(artworks);
        }
    }

    Promise.all(promises).then( function () {
        search.disconnectdb();
    });

}


for (let i = 1; i < process.argv.length; i++) {
    if (process.argv[i] === '-h'
        || process.argv[i] === '--help') {
        console.log('Usage: serv/translate.js [-f FILE]');
    } else if (process.argv[i] === '-f') {
        assert( i < process.argv.length - 1,
                'Insufficiently parameters. Try `-h`.' );
        i += 1;

        logger.info('Importing from Tekuma Firebase database of artworks...');
        exports.translate_from_tekuma_firebase(process.argv[i]);

    }
}
