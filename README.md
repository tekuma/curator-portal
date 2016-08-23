# Tekuma Curator Portal
--------------------------
The curators interface for accessing the Tekuma Art Database

## Usage
This project is in development. Clone, run `npm install`, and serve to use.

## Developmental Plans
Currently, the front-end interface exists. The back-end query framework still needs to be developed. Possible ways to do this:

1. The Firebase way: Create a Google Compute Engine server that is always listening. On this server, execute a function which connects to the Curator Database. Inside of this script, make a listener which is always listening for new children to be added to a "requests" node of the curator firebase database. Then, from the statically served front-end interface, form queries and push them to this node. The server can then read the request and use a technology such as ElasticSearch to query some large database and push a response to a "responses" node in the Firebase Database.

2. Old Fashioned way: Use AJAX or XMLHTTP to send requests to a formal server and do queries.

3. The too-easy way: Use the firebase database as the art database, and iterate through the entire DB to do queries. 
