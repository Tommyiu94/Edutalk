var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//For creating Post requests 
var unirest = require('unirest');

//uncomment below line to use custom peerjs server
//Peer Server Object
//var ExpressPeerServer = require('peer').ExpressPeerServer;

//uncomment below lines to use custom peerjs server.
//var options = {
//    debug: true
//}

//Enable CORS 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});


//uncomment below line to use custom peer server
//Initialise peer server
//app.use('/api', ExpressPeerServer(http, options));


app.use(express.static(__dirname + '/public'));


http.listen( (process.env.PORT || 8080), function(){
  console.log('Server running');
});
