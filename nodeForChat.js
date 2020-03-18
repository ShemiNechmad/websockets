var WebSocketServer = require('websocket').server;
var http = require('http');
var express = require('express');
var app = express();
const cors = require('cors')


var server = http.createServer(function (request, response) {
});
server.listen(3000, function () { console.log('listening shem') });
var clients = [];
var usersOnline = [];
wsServer = new WebSocketServer({httpServer: server});

wsServer.on('request', function (request) {
  var connection = request.accept(null, request.origin);
  clients.push(connection);
  connection.on('message', function (message) {
    let obj = JSON.parse(message.utf8Data);
    if (obj.user) {
      usersOnline.push({ user: obj.user });
      clients.forEach(function (client) {
        client.send('{"user":"' + obj.user + '"}');
      });
    }
    if (obj.userOffline) {
      for (let i = 0; i < usersOnline.length; i++) {
        if (usersOnline[i].user === obj.userOffline) {
          usersOnline.splice(i, 1);
          clients.forEach(function (client) {
            client.send('{"userOffline":"' + obj.userOffline + '"}');
          });
        }
      }
    }
    if (obj.author) {
      clients.forEach(function (client) {
        client.send('{"author":"' + obj.author + '", "message":"' + obj.message + '"}');
      });
    }
  });

  connection.on('close', function (connection) {
  });
});

//-----------------------------------HTTP REQUESTS---------------------------------------
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.listen(8080, () => {
  console.log('express 8080 started!')
})
app.get('/chat', function (req,res){
  console.log('got and sending');
  res.send({users:usersOnline});
});


