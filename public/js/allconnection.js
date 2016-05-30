var PeerConnection = require('./PeerConnection');
var socket = io('http://localhost:8080');

function AllConnection(){
	var local;
	var configuration = {
			"iceServers": [{ "url": "stun:stun.1.google.com:19302"
			}]
	};
	var connection;
}

AllConnection.prototype.setLocal = function(user){
	this.local = user;
	this.connection = {};
}

AllConnection.prototype.initConnection = function(peer){
	var self = this;
	self.connection[peer] = new PeerConnection(self.local, peer);
	self.connection[peer].createVideo(peer, function(){
		self.connection[peer].startConnection(peer, function(){
			self.connection[peer].makeOffer( function(offer){
				console.log("send offer to " + peer);
				console.log(offer);
				socket.emit("SDPOffer", {
					type: "SDPOffer",
					local: self.local,
					remote: peer,
					offer: offer
				});
			})
		})
	})
}

AllConnection.prototype.buildEnvironment = function(data, cb){
	var self = this;
	console.log(data);
	self.connection[data] = new PeerConnection(self.local, data);
	self.connection[data].createVideo(data, function(){
		self.connection[data].startConnection(data, function(){
			cb();
		});
	});
}

AllConnection.prototype.onOffer = function(data){
	var self = this;
	console.log(data.remote);
	self.connection[data.remote].receiveOffer(data, function(answer){
		socket.emit("SDPAnswer", {
			type: "SDPAnswer",
			local: self.local,
			remote: data.remote,
			answer: answer
		});
		console.log(self.connection[data.remote].p2pConnection.localDescription);
		console.log(self.connection[data.remote].p2pConnection.remoteDescription);
	}) 
}

AllConnection.prototype.onAnswer = function(data){
	this.connection[data.remote].receiveAnswer(data);
}

AllConnection.prototype.onCandidate = function(data){
	console.log("ice candidate is ");
	console.log(data.candidate);
	console.log("from ");
	console.log(data.remote);
	this.connection[data.remote].addCandidate(data);
}

module.exports = AllConnection;