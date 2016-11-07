// Manage remote (backend) assets
//
// E.g., drop all tables from a database and create new tables
// according to a model.
//
// In general this tool uses the same db configuration files and
// authentication as the search server.
//
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston

const assert = require('assert');


var cmd_index = null;

for (let i = 2; i < process.argv.length; i++) {
    cmd_index = i;
    break;
}
assert(cmd_index,
       'Some command must be given. Try `help`');


if (process.argv[cmd_index] === 'clear') {

    const servconf = require('./server-config.json');
    const search = require('./search.js');
    const dbconf = require(servconf.artworkdb);
    search.connectdb(dbconf);
    console.log('Resetting database...');
    search.cleardb();
    search.disconnectdb();

} else if (process.argv[cmd_index] === '-h'
           || process.argv[cmd_index] === '--help'
           || process.argv[cmd_index] === 'help') {

    console.log('Usage: serv/manage.js [-h] COMMAND [OPTIONS...]\n\n'+
                '    help        Print usage and exit.\n'+
                '    clear       Reset database; drop tables, create new ones, etc.\n'+
                '    info        Print summary of backend configuration.\n');

} else if (process.argv[cmd_index] === 'info') {
    const servconf = require('./server-config.json');
    const dbconf = require(servconf.artworkdb);
    const full_config = {


    };
    console.log(JSON.stringify(
        {
            servconf: servconf,
            dbconf: dbconf
        },
        null, 4));

} else {
    console.log( 'Unrecognized command: '+process.argv[cmd_index] );
    console.log( 'Try `help`.' );
    process.exitCode = 1;  // Errored usage.
}