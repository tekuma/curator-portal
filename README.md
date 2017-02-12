# Tekuma Curator Portal
--------------------------
The curators interface for accessing the Tekuma Art Database

## Workflow and versioning

Instructions for deploying are given near the end of this document. Deployment
corresponds to the tip of `master` branch. As such, development should occur on
branches other than `master`. The version number is kept in package.json.
Currently, there is no practice of tagging commits because merges into `master`
branch represent releases.


## Development

Note that logging behavior and (eventually) some other aspects of operation are
affected by whether the environment variable `NODE_ENV` equals `'production'`.
For development, you should use

    export NODE_ENV=debug

e.g., which provides verbose logging. If you use `./dev-spin.sh` during
development and `./auto-restart.sh` (both of which are described elsewhere in
this document), then manually changing `NODE_ENV` should not be necessary.

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


### Tests particular client-side

To get the Selenium standalone server that the curator-portal configuration of
Nightwatch (http://nightwatchjs.org/) is expecting,

    ./get-testing-deps.sh

For end-to-end testing, install ChromeDriver
(https://sites.google.com/a/chromium.org/chromedriver/).
On a Debian GNU/Linux (or Ubuntu, or Mint, or similar) host, try

    sudo apt-get install chromedrive

Note that nightwatch.json lists the path of the ChromeDriver executable as
/usr/lib/chromium/chromedriver, which is consistent with the location from the
`chromedrive` deb package. You might need to change the path on other systems.


### Tests of server-side software

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

For both client and server-side testing, there is a mock of the `firebase`
NodeJS package. The Tekuma repository of it can be found at
https://github.com/tekuma/mock-firebase
To install it locally, clone the repository and then use a command of the form

    npm install /path/to/mock-firebase

For it to be used client-side, replace all imports from `firebase` to
`mock-firebase`, e.g., by

    sed -i "s/from 'firebase'/from 'mock-firebase'/g" app/**/*.jsx

It should be possible to automate this as part of testing, e.g., using
`webpack`. (low priority, unassigned task)

#### Using the remote testing, staging host

For SSH to accept the private key, the file permissions must not allow read
access by users other than you. E.g., this can be achieved from

    chmod 600 conf/keys/staging

#### Using an existing remote database

There is a CloudSQL database named "test-artworkdb" on the Google Cloud project
curator-tekuma. If it does not exist, note that the next section describes how
to create a remote CloudSQL database for testing. If it exists, then it should
suffice to change server-config.json to point to the relevant remote testing
database configuration:
```js
"artworkdb": "./test-remote-dbconf.json"
```

#### Initializing a remote database for testing

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

#### Creating a local MySQL database in a Docker container

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


## Code style

Some of the details of the preferred code style of Tekuma remain to be fixed.
Meanwhile, certain aspects of style are fixed, such as that indentation is in
units of 4 spaces, no tab characters.

Though their usage is not required, there are linting configurations available
for ESLint <http://eslint.org/> that you can run using

    npm run lint


## Deployment

`master` branch is supposed to match the site as it is deployed. As such, before
following the instructions below, increment the version number in package.json,
and merge all changes into `master` branch.  Change server-config.json to have
`"artworkdb": "./remote-dbconf.json"`, and then, build the client-side bundle,
and rsync relevant data to the GCE instance:

    npm run build
    ./deploy.sh

From the instance, stop nginx if it is running, `sudo nginx -s stop`, then

    cd ~/curator-portal
    sudo nginx -c `pwd`/conf/nginx.conf
    screen -d -m ./auto-restart.sh
