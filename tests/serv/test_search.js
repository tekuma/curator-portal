var assert = require('assert');

const search = require('../../serv/search.js');
const dbconf = require('../testdbconf.json');


describe('search', function() {

    beforeEach('Opening database connection', function() {
        var db = search.connectdb(dbconf, 'sqlite3');
        db.serialize(function () {
            db.run('CREATE TABLE artworks (artist TEXT, title TEXT, description TEXT, date_of_addition DATETIME, artist_uid CHAR(255), artwork_uid CHAR(255), date_of_creation DATETIME, tags TEXT, thumbnail_url CHAR(255), origin CHAR(32), reverse_lookup CHAR(255), META TEXT)');
            var insert_template = db.prepare('INSERT INTO artworks (artist, title, tags) VALUES (?, ?, ?)');
            insert_template.run(['Scott', 'deadbeef', '32bit,Intel']);
            insert_template.run(['Scott', 'f00f', 'hex']);
            insert_template.finalize();
        });
    });
    afterEach('Closing database connection', function() {
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
