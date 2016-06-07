var io = require('socket.io-client');
var signalSocket = io.connect("http://localhost:8080");
var taskSocket = io.connect("http://localhost:8888");

signalSocket.emit("admin");
taskSocket.emit("admin");
console.log("admin start to work");

signalSocket.on("newUser", function(userData){
	taskSocket.emit("newUser", {
		type: "newUser",
		userName: userData.userName
	});
});

signalSocket.on("disconnectedUser", function(userData){
	taskSocket.emit("disconnectedUser", {
		type: "disconnectedUser",
		userName: userData.userName
	});
});

taskSocket.on("newPeerConnection", function(userData){
	signalSocket.emit("peerConnection", {
		type: "peerConnection",
		userName: userData.userName,
		host: userData.host
	});
})
