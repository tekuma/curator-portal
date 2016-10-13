var assert = require('assert');

const search = require('../../serv/search.js');
const dbconf = require('../testdbconf.json');


describe('search', function() {

    beforeEach('Opening database connection', function() {
        search.connectdb(dbconf);
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

});
