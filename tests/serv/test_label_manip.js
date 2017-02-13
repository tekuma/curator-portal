// tests on reading, parsing, modifying labels
//
// Copyright 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston


const assert = require('assert');

const search = require('../../serv/search.js');
const dbconf = require('../testdbconf.json');


describe('labels', function () {

    before('Opening database connection', function (done) {
        console.log('TEKUMA_TEST_DB: '+process.env.TEKUMA_TEST_DB);
        if (typeof process.env.TEKUMA_TEST_DB !== 'undefined') {
            var db = search.connectdb(dbconf, process.env.TEKUMA_TEST_DB);
        } else {
            var db = search.connectdb(dbconf, 'sqlite');
        }

        const initial_artworks = [{uid: 'deadbeef', title: '4 beef',
                                   artist_uid: 'sth14sth',
                                   thumbnail_url: 'https://storage.googleapis.com/art-uploads/portal/sth14sth/thumb128/deadbeef' },
                                  {uid: 'f00fba54', title: 'frozzle',
                                   artist_uid: 'sth14sth'}];

        const initial_artists = [{uid: 'sth14sth', artist: 'Ricardo', human_name: 'Ricardo'}];

        const initial_labels = [{artwork_uid: 'deadbeef',
                                 val: '#696969 0.6145',
                                 type: 'clarifai-w3c-color-density',
                                 origin: 'Clarif.ai'},
                                {artwork_uid: 'deadbeef',
                                 val: '#a9a9a9 0.3855',
                                 type: 'clarifai-w3c-color-density',
                                 origin: 'Clarif.ai'},
                                {artwork_uid: 'f00fba54',
                                 val: '#ffe4c4 0.8',
                                 type: 'clarifai-w3c-color-density',
                                 origin: 'Clarif.ai'},
                                {artwork_uid: 'deadbeef',
                                 val: 'beefy',
                                 type: 'clarifai-text-tag',
                                 origin: 'Clarif.ai'}];

        search.cleardb().then(function () {
            Promise.all([
                search.insert_artworks(initial_artworks),
                search.insert_artists(initial_artists),
            ]).then(function () {
                Promise.all(initial_labels.map(label => {
                    return search.apply_label(label.artwork_uid, label, true);
                })).then( function () { done(); } );
            });
        });
    });
    after('Closing database connection', function () {
        search.disconnectdb();
    });

    describe('#get_detail', function () {
        it('should fail to find artwork with given UID',
           function () {
               return search.get_detail('1337f00f').then(function (detail) {
                   assert( detail.found === false );
               });
           });
    });

    describe('REGRESSION: duplicate artworks in results', function () {
        it('should not find the artwork "4 beef" (UID deadbeef) more than once',
           function () {
               return search.q('beef').then(function (rows) {
                   var counter = 0;
                   for (let j = 0; j < rows.length; j++) {
                       if (rows[j].uid === "deadbeef") {
                           counter += 1;
                       }
                   }
                   assert( counter === 1 );
               });
           });
    });
});
