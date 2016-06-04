var io = require('socket.io-client');
var socket = io.connect("http://localhost:8080");

socket.emit("admin");

socket.on("newUser", function(userData){
	socket.emit("peerConnection", {
		type: "peerConnection",
		newUser: userData.userName,
		host: userData.host
	});
});
