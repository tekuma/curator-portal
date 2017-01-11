// small tests for using `GET /detail` and calling get_detail()
//
// Copyright 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston


const assert = require('assert');

const search = require('../../serv/search.js');
const dbconf = require('../testdbconf.json');


describe('getting details about artworks', function() {

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

    describe('#get_detail', function() {
        it('should fail to find artwork with given UID',
           function() {
               return search.get_detail('1337f00f').then(function(detail) {
                   assert( detail.found === false );
               });
           });
    });

    describe('#get_detail', function() {
        it('should return `uid` that matches given artwork UID',
           function() {
               return search.get_detail('deadbeef').then(function(detail) {
                   assert( detail.found === true );
                   assert( detail.uid === 'deadbeef' );
               });
           });
    });
});
