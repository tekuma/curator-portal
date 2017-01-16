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

    var raw_db = (fs.readFileSync(filename, 'utf8')
                  .replace(/\\u/g, '\\\\u')
                  .replace(/\\x/g, '\\\\x'));
    var firebase_db = JSON.parse(raw_db);
    var insertion_promise = new Promise(function (resolve, reject) { resolve(); });
    for (artist_uid in firebase_db) {
        logger.debug('Importing entry for artist UID: ', artist_uid);

        if (firebase_db[artist_uid].artworks === undefined
            || firebase_db[artist_uid].display_name === undefined) {
            logger.debug('Entry for artist UID',
                         artist_uid,
                         'does not have `artworks` or `displayname` fields');
            continue;
        }

        let at_least_one_artwork = false;
        for (artwork_ref in firebase_db[artist_uid].artworks) {
            if (firebase_db[artist_uid].artworks[artwork_ref].id === undefined) {
                logger.warn('Skipping artwork with missing UID by artist ' + artist_uid);
                continue;
            }
            at_least_one_artwork = true;

            let artwork = {
                uid: firebase_db[artist_uid].artworks[artwork_ref].id,
                title: firebase_db[artist_uid].artworks[artwork_ref].title || '',
                artist_uid: artist_uid,
                thumbnail_url: ('https://storage.googleapis.com/art-uploads/portal/'
                                +artist_uid+'/thumb128/'
                                +firebase_db[artist_uid].artworks[artwork_ref].id)
            };
            logger.debug('Pushing artwork:', artwork);
            let label_promises = [search.insert_artwork(artwork)];

            if (firebase_db[artist_uid].artworks[artwork_ref].tags) {
                for (let j = 0; j < firebase_db[artist_uid].artworks[artwork_ref].tags.length; j++) {
                    if (firebase_db[artist_uid].artworks[artwork_ref].tags[j].text.length === 0)
                        continue;
                    let label = {
                        type: 'clarifai-text-tag',
                        origin: 'Clarif.ai',
                        val: firebase_db[artist_uid].artworks[artwork_ref].tags[j].text
                    };
                    logger.debug('Pushing label:', label)
                    label_promises[label_promises.length] = search.apply_label(artwork.uid, label, true);
                }
            }
            insertion_promise = insertion_promise.then(function () {
                return Promise.all(label_promises);
            });
        }
        if (at_least_one_artwork) {
            let artist_row = {
                uid: artist_uid,
                artist: firebase_db[artist_uid].display_name || ''
            };
            logger.debug('Pushing artist:', artist_row);
            insertion_promise = insertion_promise.then(function () { return search.insert_artist(artist_row); });
        }
    }

    insertion_promise.then(function () {
        return search.consolidate_all_labels();
    }).then(function () {
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
