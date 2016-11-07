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

        const initial_data = [{uid: 'deadbeef', title: '4 beef'},
                              {uid: 'f00fba54', title: 'frozzle'},
                              {uid: 'abc123d4', title: 'Scott\'s entry'}];

        search.cleardb().then(function () {
            search.insert_artworks(initial_data).then(function() { done(); });
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
        it('should not find any rows from "some_random_text_aksrarhxschal" query', function() {
            return search.q('some_random_text_aksrarhxschal').then(function(rows) {
                assert( rows.length === 0 );
            });
        });
    });

});
