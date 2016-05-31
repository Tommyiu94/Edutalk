var AllConnection = require('./AllConnection');

function WebRTC(server){
	var self = this;
	var user;
	var allConnection;
	this.socket = io(server);

	self.socket.on("peer", function(data){
		document.getElementById("peer").value = "";
		console.log(data.allUser);
		var peerList = "";
		for (var i in data.allUser ) {
			peerList += data.allUser[i] + " ";
			console.log("peerList is " + peerList);
		}
		console.log = peerList;
	})

	self.socket.on("feedback", function(data) {
		console.log("feedback: " + data);
	})

	self.socket.on("newUser", function(data) {
		console.log("newUser");
		console.log(data);
		self.allConnection.buildEnvironment(data, function(){
			self.socket.emit("ICESetupStatus", {
				type: "ICESetupStatus",
				local: self.user,
				remote: data,
				ICESetupStatus: "DONE"
			});
			console.log(data);
			console.log("ICE setup Ready");
		});
	})

	self.socket.on("SDPOffer", function(data) {
		self.allConnection.onOffer(data);
	})

	self.socket.on("SDPAnswer", function(data) {
		console.log("receive answer");
		self.allConnection.onAnswer(data);
	})

	self.socket.on("candidate", function(data) {
		self.allConnection.onCandidate(data);
	})

	self.socket.on("ICESetupStatus", function(data){
		console.log("start to connent to " + data.remote);
		console.log(data.remote);
		self.allConnection.initConnection(data.remote);
	})

	self.socket.on("disconnectedUser", function(data) {
		console.log("user " + data + " is disconnected");
		self.allConnection.connection[data] = null;
		self.onUserDisconnect(data);
	})
}

WebRTC.prototype.login = function(userName, successCallback, failCallback) {
	var self = this;
	this.socket.emit("login", userName);
	this.socket.on("login", function(data){
		if (data.status === "success") {
			self.user = data.userName;
			successCallback();
		} else if (data.status === "fail") {
			failCallback();
		}
	});
}

WebRTC.prototype.createRoom = function(roomId, successCallback, failCallback){
	var self = this;
	this.socket.emit("createRoom", roomId);
	this.socket.on("createRoom", function(data){
		if (data.status === "success") {
			successCallback();
		} else if (data.status === "fail") {
			failCallback();
		}
	});
}

WebRTC.prototype.startCamera = function(){
	var self = this;
	try {
		self.allConnection = new AllConnection();
		self.allConnection.init(self.user, self.socket, function(){
			self.socket.emit("setupCamera", {
				type: "setupCamera",
				cameraSetupStatus: "success"
			});
		});
	}catch(e){
		self.socket.emit("setupCamera", {
			type: "setupCamera",
			cameraSetupStatus: "fail"
		});
	}
}

WebRTC.prototype.joinRoom = function(roomId, successCallback, failCallback) {
	var self = this;
	this.socket.emit("joinRoom", roomId);
	this.socket.on("joinRoom", function(data){
		if (data.status === "success") {
			successCallback();
		} else if (data.status === "fail") {
			failCallback();
		}
	});
}

WebRTC.prototype.muteVideo = function(vid){
	vid.pause();
	vid.src = "";
	stream.getTracks()[0].stop();
	console.log("Vid off");
}

WebRTC.prototype.muteAudio = function(){
	webrtc.muteAudio();
}

WebRTC.prototype.unmuteVideo = function(){
	webrtc.unmuteVideo();
}

WebRTC.prototype.unmuteAudio = function(){
	webrtc.unmuteAudio();
}

WebRTC.prototype.getPeers = function(){
	var self = this;
	console.log("user is " + self.user);
	this.socket.emit("peer", self.user);
}

WebRTC.prototype.onUserDisconnect = function(data){
}

module.exports = WebRTC;