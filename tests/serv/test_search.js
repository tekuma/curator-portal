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

        const initial_data = [['deadbeef', '4 beef'],
                              ['f00fba4', 'frozzle']];

        if (search.provider() === 'sqlite') {
            search.cleardb().then(function () {
                db.serialize(function () {
                    var insert_template = db.prepare('INSERT INTO artworks ' +
                                                     '(uid, title) VALUES (?, ?)');
                    for (var i = 0; i < initial_data.length; i++) {
                        insert_template.run(initial_data[i]);
                    }
                    insert_template.finalize(done);
                });
            });
        } else {  // === 'mysql'
            db.query('insert into artworks (uid, title) values (?, ?), (?, ?)',
                     initial_data[0].concat(initial_data[1]),
                     function (err, rows, fields) {
                         if (err) throw done(err);
                         done();
                     });
        }
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
