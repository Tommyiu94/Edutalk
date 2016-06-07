var io = require('socket.io-client');
var cpuSocket = io.connect("http://localhost:8888");

cpuSocket.emit("cpu");

cpuSocket.on("peerConnection", function(userData){

	console.log("start to work");
	cpuSocket.emit("newPeerConnection", {
		type: "newPeerConnection",
		userName: userData.userName,
		host: userData.host
	});
});
