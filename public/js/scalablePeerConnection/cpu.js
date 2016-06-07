var io = require('socket.io-client');
var cpuSocket = io.connect("http://localhost:8888");
var UserList = require('./userlist.js');

cpuSocket.emit("cpu");

console.log("cpu start to work");

cpuSocket.on("newUser", function(userData){
	console.log("add user " + userData.userName);
	UserList.addUser(userData.userName, function(userName, host){
		if (userName === null){
			cpuSocket.emit("host", {
				type: "host",
				host: host,
			});
		}else {
			cpuSocket.emit("newPeerConnection", {
				type: "newPeerConnection",
				userName: userName,
				host: host
			});
		}
	}, function(){
		console.log("add user failed");
		cpuSocket.emit("addUserFailure", {
			type: "addUserFailure",
			userName: userData.userName
		});
	});
});

cpuSocket.on("disconnectedUser", function(userData){
	console.log("start to work");
	UserList.deleteUser(userData.userName, function(userName, host){
		cpuSocket.emit("newPeerConnection", {
			type: "newPeerConnection",
			userName: userName,
			host: host
		});
	}, function(){
		cpuSocket.emit("deleteUserFailure", {
			type: "deleteUserFailure",
			userName: userData.userName,
		});
	});
});
