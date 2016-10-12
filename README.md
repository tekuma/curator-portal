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

## Testing

https://hub.docker.com/_/mysql/
To get it, `docker pull mysql:latest`

To initialize a MySQL database in a Docker container for testing,

    ./tests/init.sh

and use the connection configuration in tests/testdbconf.json.

### Initializing a remote database for testing

```sh
mysql -uroot '--password=PASSPHRASE' --host=104.198.210.91 --ssl-cert=serv/cert/test-sql-client-cert.pem --ssl-key=serv/cert/test-sql-client-key.pem --ssl-ca=serv/cert/test-sql-server-ca.pem < tests/initdb.sql
```


## Deployment

Create a snapshot of the repository, which will be used as a starting point for
building and deploying the site.

    git archive --format=tar --prefix=curator-portal/ HEAD |gzip -9 > deploy.tar.gz
