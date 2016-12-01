// small tests for calling q() with nonempty fields
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston


const assert = require('assert');
const readline = require('readline');

const search = require('../../serv/search.js');
const dbconf = require('../testdbconf.json');


describe('search with fields', function() {

    before('Opening database connection', function(done) {
        console.log('TEKUMA_TEST_DB: '+process.env.TEKUMA_TEST_DB);
        if (typeof process.env.TEKUMA_TEST_DB !== 'undefined') {
            var db = search.connectdb(dbconf, process.env.TEKUMA_TEST_DB);
        } else {
            var db = search.connectdb(dbconf, 'sqlite');
        }

        const initial_artworks = [{uid: 'deadbeef', title: '4 beef',
                                   artist_uid: 'sth14sth'},
                                  {uid: 'f00fba54', title: 'frozzle',
                                   artist_uid: 'sth14sth'}];

        const initial_artists = [{uid: 'sth14sth', artist: 'Ricardo', human_name: 'Ricardo'}];

        search.cleardb().then(function () {
            Promise.all([
                search.insert_artworks(initial_artworks),
                search.insert_artists(initial_artists)
            ]).then( function () { done(); } );
        });
    });
    after('Closing database connection', function() {
        search.disconnectdb();
    });

    describe('#q', function() {
        it('should find at least one row from {q:"", title:"beef"} query',
           function() {
               return search.q('', {title: 'beef'}).then(function(rows) {
                   assert( rows.length > 0 );
               });
           });
    });

    describe('#q', function() {
        it('should find zero rows from {q:"beef", artist:"Scott"} query',
           function() {
               return search.q('beef', {artist: 'beef'}).then(function(rows) {
                   assert( rows.length === 0 );
               });
           });
    });
});
