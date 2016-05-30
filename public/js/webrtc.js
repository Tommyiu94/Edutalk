//var io = require('./node_modules/socket.io/node_modules/socket.io-client/socket.io.js');
var AllConnection = require('./AllConnection');
var socket = io('http://localhost:8080');

function WebRTC(){
	var self = this;
	var user;
	var allConnection;

	socket.on("createRoom", function(data){
		self.onCreateRoom(data);
	})

	socket.on("joinRoom", function(data){
		self.onJoinRoom(data);
	})

	socket.on("login", function(data) {
		if (data.status === "success"){
			self.allConnection = new AllConnection();
			user = data.userName;
			self.allConnection.setLocal(user);
		} else if (data.status === "fail"){
			document.getElementById("feedback").value = "User " + data.userName + " already exists";
		}
		self.onLogin(data);
	})
	
	socket.on("feedback", function(data) {
		document.getElementById("feedback").value = data;
	})

	socket.on("newUser", function(data) {
		console.log("newUser");
		console.log(data);
		self.allConnection.buildEnvironment(data, function(){
			socket.emit("ICESetupStatus", {
				type: "ICESetupStatus",
				local: user,
				remote: data,
				ICESetupStatus: "DONE"
			});
			console.log("ICE setup Ready");
		});
	})

	socket.on("SDPOffer", function(data) {
		self.allConnection.onOffer(data);
	})

	socket.on("SDPAnswer", function(data) {
		console.log("receive answer");
		self.allConnection.onAnswer(data);
	})
	
	socket.on("candidate", function(data) {
		self.allConnection.onCandidate(data);
	})

	socket.on("ICESetupStatus", function(data){
		console.log("start to connent to " + data.remote);
		self.allConnection.initConnection(data.remote);
	})
}

WebRTC.prototype.onCreateRoom = function(data){};
WebRTC.prototype.onJoinRoom = function(data){};
WebRTC.prototype.onLogin = function(data){};

WebRTC.prototype.sendUserName = function(userName) {
			socket.emit("login", userName);
}

WebRTC.prototype.createRoom = function(roomId) {
			socket.emit("createRoom", roomId);
}

WebRTC.prototype.joinRoom = function(roomId) {
			socket.emit("joinRoom", roomId);
}

module.exports = WebRTC;