var io = require('socket.io-client');
var signalSocket = io.connect("http://localhost:8080");
var taskSocket = io.connect("http://localhost:8888");

signalSocket.emit("admin");
taskSocket.emit("admin");

signalSocket.on("newUser", function(userData){
	taskSocket.emit("peerConnection", {
		type: "peerConnection",
		userName: userData.userName,
		host: userData.host
	});
});

taskSocket.on("newPeerConnection", function(userData){
	signalSocket.emit("peerConnection", {
		type: "peerConnection",
		userName: userData.userName,
		host: userData.host
	});
})
