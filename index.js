var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
});
server.listen(3000, function() { console.log('listening shem')});
var clients = [];

wsServer = new WebSocketServer({
  httpServer: server
});

wsServer.on('request', function(request) {
  var connection = request.accept( null, request.origin);
    clients.push(connection);
    connection.on('message', function(message) {
    console.log(message);
    clients.forEach(function(client) {
        client.send("{'author':'Shemi', 'message':'Nechmad'}");
    });
  });

  connection.on('close', function(connection) {
  });
});
 


