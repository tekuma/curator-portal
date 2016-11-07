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

for (let i = 1; i < process.argv.length; i++) {
    if (process.argv[i] === '-h'
        || process.argv[i] === '--help') {
        console.log('Usage: serv/manage.js [-h] COMMAND [OPTIONS...]');
        process.exit();
    }
}
