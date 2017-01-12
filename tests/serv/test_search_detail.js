// small tests for using `GET /detail` and calling get_detail()
//
// Copyright 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston


const assert = require('assert');

const search = require('../../serv/search.js');
const dbconf = require('../testdbconf.json');


describe('getting details about artworks', function () {

    before('Opening database connection', function (done) {
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

    describe('#get_detail', function () {
        it('should return `uid` that matches given artwork UID',
           function () {
               return search.get_detail('deadbeef').then(function (detail) {
                   assert( detail.found === true );
                   assert( detail.uid === 'deadbeef' );
               });
           });
    });

    describe('#get_othersize', function () {
        it('should return `null` because given string that is not valid URL',
           function () {
               assert( search.get_othersize('xxx', 512) === null );
           });
    });

    describe('#get_othersize', function () {
        it('should return `null` because given string is malformed',
           function () {
               assert( search.get_othersize('https://storage.googleapis.com/art-uploads/portal/40qcVX8wk7MvfRCnh86VJKd6Ev22/thumb-KPCTx19sL8L97eqfnnZ', 512) === null );
           });
    });

    describe('#get_othersize', function () {
        it('maps https://storage.googleapis.com/art-uploads/portal/40qcVX8wk7MvfRCnh86VJKd6Ev22/thumb128/-KPCTx19sL8L97eqfnnZ to thumbnail 512 px width variant',
           function () {
               assert( search.get_othersize('https://storage.googleapis.com/art-uploads/portal/40qcVX8wk7MvfRCnh86VJKd6Ev22/thumb128/-KPCTx19sL8L97eqfnnZ', 512) === 'https://storage.googleapis.com/art-uploads/portal/40qcVX8wk7MvfRCnh86VJKd6Ev22/thumb512/-KPCTx19sL8L97eqfnnZ' );
           });
    });

    describe('#get_othersize', function () {
        it('maps https://storage.googleapis.com/art-uploads/portal/40qcVX8wk7MvfRCnh86VJKd6Ev22/thumb128/-KPCTx19sL8L97eqfnnZ to full size ("raw") variant',
           function () {
               assert( search.get_othersize('https://storage.googleapis.com/art-uploads/portal/40qcVX8wk7MvfRCnh86VJKd6Ev22/thumb128/-KPCTx19sL8L97eqfnnZ', 0) === 'https://storage.googleapis.com/art-uploads/portal/40qcVX8wk7MvfRCnh86VJKd6Ev22/uploads/-KPCTx19sL8L97eqfnnZ' );
           });
    });

    describe('#get_othersize', function () {
        it('maps https://storage.googleapis.com/art-uploads/portal/40qcVX8wk7MvfRCnh86VJKd6Ev22/thumb128/-KPCTx19sL8L97eqfnnZ to thumbnail 128 px width variant',
           function () {
               assert( search.get_othersize('https://storage.googleapis.com/art-uploads/portal/40qcVX8wk7MvfRCnh86VJKd6Ev22/thumb128/-KPCTx19sL8L97eqfnnZ', 128) === 'https://storage.googleapis.com/art-uploads/portal/40qcVX8wk7MvfRCnh86VJKd6Ev22/thumb128/-KPCTx19sL8L97eqfnnZ' );
           });
    });
});
