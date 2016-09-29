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
