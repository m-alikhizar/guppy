// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-game';

// Port where we'll run the websocket server
var webSocketsServerPort = 1337;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

/**
 * Global variables
 */
// list of currently connected clients (users)
var clients = [ ];

function matchingPath() {
    //for()
}
/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Array of symbols
var symbols = [ 'x', 'v'];

/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin);

    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;
    var name = false;
    var symbol = false;

    console.log((new Date()) + ' Connection accepted.');

    // user sent some message
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only text
            if (name === false) { // first message sent by user is their name
                // remember user name
                name = htmlEntities(message.utf8Data);
                // get random symbol and send it back to the user
                symbol = symbols.shift();

                connection.sendUTF(JSON.stringify({ type:'symbol', data: symbol }));

            } else { // log and broadcast the message
                console.log((new Date()) + ' Received Message from '
                            + name + ': ' + message.utf8Data);
                
                var obj = {
                    time: (new Date()).getTime(),
                    text: htmlEntities(message.utf8Data),
                    author: name,
                    symbol: symbol
                };

                var json = JSON.stringify({ type:'message', data: obj });

                for (var i=0; i < clients.length; i++) {
                    clients[i].sendUTF(json);
                }
            }
        }
    });

    // user disconnected
    connection.on('close', function(connection) {
        if (name !== false && symbol !== false) {
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            // remove user from the list of connected clients
            clients.splice(index, 1);
            // push back user's symbol to be reused by another user
            symbols.push(symbol);
        }
    });
});
