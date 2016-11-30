// tests for search routines
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston


const assert = require('assert');
const readline = require('readline');

const search = require('../../serv/search.js');
const dbconf = require('../testdbconf.json');


describe('search', function() {

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
                                   artist_uid: 'sth14sth'},
                                  {uid: 'abc123d4', title: 'Scott\'s entry',
                                   artist_uid: 'ubldh51l'},
                                  {uid: 'cafe1337', title: 'craş',
                                   artist_uid: 'ubldh51l'}];

        const initial_artists = [{uid: 'ii1j1srh', artist: 'Diane', human_name: 'Diane'},
                                 {uid: 'sth14sth', artist: 'Ricardo', human_name: 'Ricardo'},
                                 {uid: 'ubldh51l', artist: 'nocturnalnectar', human_name: 'Scott'}];

        const initial_labels = [{uid: 'xbldh51l',
                                 term: 'name in title', labeltype: 'keywords'}];
        const initial_associations = [{label_uid: 'xbldh51l',
                                       object_uid: 'abc123d4', object_table: 'artworks'}];


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
        it('should find at least one row from "beef" query', function() {
            return search.q('beef').then(function(rows) {
                assert( rows.length > 0 );
            });
        });
    });

    describe('#q', function() {
        it('should find at least one row from "BEEF" query because case insensitivity', function() {
            return search.q('BEEF').then(function(rows) {
                assert( rows.length > 0 );
            });
        });
    });

    describe('#q', function() {
        it('should not find any rows from "some_random_text_aksrarhxschal" query', function() {
            return search.q('some_random_text_aksrarhxschal').then(function(rows) {
                assert( rows.length === 0 );
            });
        });
    });

    describe('#q', function() {
        it('should find at least one row from "ş" query (testing UTF-8)', function() {
            return search.q('ş').then(function(rows) {
                assert( rows.length > 0 );
            });
        });
    });

});
