# Tekuma Curator Portal
--------------------------
The curators interface for accessing the Tekuma Art Database

## Preparations

This project is in development. Clone, and run `npm install`.

## Development

To start the development Web server, use

    ./dev-spin.sh

which depends on nginx to be installed on the development system. Instructions
to obtain nginx are available at http://nginx.org/en/docs/install.html
For testing, client-side code is provider by `webpack-dev-server`, which
monitors app/ and automatically updates the output (no need to `npm run build`
during development). As part of `dev-spin.sh`, the search process binds stdin,
so you can stop it using Ctrl-C (also known as keyboard interrupt or SIGINT).

Now, GET https://127.0.0.1/ to interact with the development server.


## Testing

To perform all tests on the server software,

    npm run testserv

The default testing configuration does NOT require access to a MySQL
database. Instead, an in-memory SQLite database is used. The database provider
during testing can be chosen via the environment variable TEKUMA_TEST_DB. If it
is not defined or `TEKUMA_TEST_DB=sqlite`, SQLite is used. To use MySQL (consult
notes below about how to access various MySQL servers),

    export TEKUMA_TEST_DB=mysql

There are several possibilities for creating or using a MySQL database for
testing.  During testing, it is critical not to use the production database
because insertions, deletions, and other table modifications. Each possibility
for MySQL servers that is currently supported during testing is described below.

### Using an existing remote database

There is a CloudSQL database named "test-artworkdb" on the Google Cloud project
curator-tekuma. If it does not exist, note that the next section describes how
to create a remote CloudSQL database for testing. If it exists, then it should
suffice to change server-config.json to point to the relevant remote testing
database configuration:
```js
"artworkdb": "./test-remote-dbconf.json"
```

### Initializing a remote database for testing

Go to the the Google Cloud project curator-tekuma, and perform the following:
1. create a new "2nd generation" CloudSQL instance;
2. go to the instance details, and select the "Access Control" tab;
3. select the "SSL" sub-tab;
4. select the option to require that all connections use SSL;
5. click on the button "Create a Client Certificate", and download all
   certificates and keys; there should be three: the server CA, and the client
   key and client certificate;
6. now select the "Users" sub-tab (still within the "Access Control" tab),
   and change the root password;
7. select the "Authorisation" sub-tab (still within the "Access Control" tab),
   and authorize a network for accessing the instance.

Create a database named `Tekuma_artworkdb`, and then enter initial data from
tests/initdb.sql in the sourcetree.
```sh
mysql -uroot '--password=PASSPHRASE' --host=104.198.210.91 --ssl-cert=serv/cert/test-sql-client-cert.pem --ssl-key=serv/cert/test-sql-client-key.pem --ssl-ca=serv/cert/test-sql-server-ca.pem < conf/initdb.sql
```

### Creating a local MySQL database in a Docker container

https://hub.docker.com/_/mysql/
To get it, `docker pull mysql:latest`

To initialize a local MySQL database in a Docker container for testing,

    ./tests/init-dcontainer.sh

and use the connection configuration in tests/testdbconf.json by changing
server-config.json to point to the relevant remote testing database
configuration:
```js
"artworkdb": "../tests/testdbconf.json"
```


## Deployment

Change to have `"artworkdb": "./remote-dbconf.json"`, and then, build the
client-side bundle, and rsync relevant data to the GCE instance:

    npm run build
    ./deploy.sh

From the instance, stop nginx if it is running, `sudo nginx -s stop`, then

    cd ~/curator-portal
    sudo nginx -c `pwd`/conf/nginx.conf
    screen -d -m auto-restart.sh
