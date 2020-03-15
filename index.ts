
import http from 'http'; 
//const http = require ('http');
import WebSocket from 'websocket';

const server = http.createServer((req, res) => {
});

const wss = new WebSocket.Server({server});
wss.on('connection', function connection(ws:WebSocket){
    ws.on('message', function incoming(msg:WebSocket.Data){
        console.log(msg);
    });
    ws.send('connected');
});


 


server.listen(4200, () => {
  console.log('hey shemm');
});