# Tekuma Curator Portal
--------------------------
The curators interface for accessing the Tekuma Art Database

## Preparations

This project is in development. Clone, and run `npm install`.

## Development

To start the development Web server that provides client-side code,
```
npm run start
```

For the server-side,
```
node serv/main.js
```
which in a testing configuration will bind to port 3030, so in your browser you
can GET https://127.0.0.1:3030

## Testing

There are several possibilities for creating or using a MySQL database for
testing. During testing, it is critical not to use the production
(a.k.a. deployed) database because insertions, deletions, and other table
modifications. Each possibility that is currently supported is described below.

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
* create a new "2nd generation" CloudSQL instance;
* go to the instance details, and select the "Access Control" tab;
* select the "SSL" sub-tab;
* select the option to require that all connections use SSL;
* click on the button "Create a Client Certificate", and download all
  certificates and keys; there should be three: the server CA, and the client
  key and client certificate.

```sh
mysql -uroot '--password=PASSPHRASE' --host=104.198.210.91 --ssl-cert=serv/cert/test-sql-client-cert.pem --ssl-key=serv/cert/test-sql-client-key.pem --ssl-ca=serv/cert/test-sql-server-ca.pem < tests/initdb.sql
```

### Creating a local MySQL database in a Docker container

https://hub.docker.com/_/mysql/
To get it, `docker pull mysql:latest`

To initialize a local MySQL database in a Docker container for testing,

    ./tests/init.sh

and use the connection configuration in tests/testdbconf.json by changing
server-config.json to point to the relevant remote testing database
configuration:
```js
"artworkdb": "../tests/testdbconf.json"
```


## Deployment

Create a snapshot of the repository, which will be used as a starting point for
building and deploying the site.

    git archive --format=tar --prefix=curator-portal/ HEAD |gzip -9 > deploy.tar.gz
