(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.WebRTC = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var PeerConnection = require('./PeerConnection');
//var socket = io('http://localhost:8080');

function AllConnection(){
	var local;
	var configuration = {
			"iceServers": [{ "url": "stun:stun.1.google.com:19302"
			}]
	};
	var connection;
	var socket;
}

AllConnection.prototype.init = function(user, socket){
	this.local = user;
	this.socket = socket;
	this.connection = {};
}

AllConnection.prototype.initConnection = function(peer){
	var self = this;
	self.connection[peer] = new PeerConnection(self.local, peer, self.socket);
	console.log("local is " + self.local + " and peer is " + peer);
	self.connection[peer].createVideo(peer, function(){
		self.connection[peer].startConnection(peer, function(){
			self.connection[peer].makeOffer( function(offer){
				console.log("send offer to " + peer);
				console.log(offer);
				self.socket.emit("SDPOffer", {
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
	self.connection[data] = new PeerConnection(self.local, data, self.socket);
	console.log("local is " + self.local + " and peer is " + data);
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
		self.socket.emit("SDPAnswer", {
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
},{"./PeerConnection":3}],2:[function(require,module,exports){
function Indicator(){}

Indicator.prototype.hasUserMedia = function(){
	navigator.getUserMedia = navigator.getUserMedia ||
	navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
	navigator.msGetUserMedia;
	return !!navigator.getUserMedia;
}

Indicator.prototype.hasRTCPeerConnection = function() {
	window.RTCPeerConnection = window.RTCPeerConnection ||
	window.webkitRTCPeerConnection || window.mozRTCPeerConnection
	window.RTCSessionDescription = window.RTCSessionDescription
	window.webkitRTCSessionDescription ||
	window.mozRTCSessionDescription;
	window.RTCIceCandidate = window.RTCIceCandidate ||
	window.webkitRTCIceCandidate || window.mozRTCIceCandidate;
	return !!window.RTCPeerConnection;
}

module.exports = Indicator;
},{}],3:[function(require,module,exports){
var Indicator = require('./Indicator');
//var socket = io('http://localhost:8080');

function PeerConnection(local, peer, socket){
	var yourVideo;
	var theirVideo;
	var theirVideoId;
	var configuration = {
			"iceServers": [{ "url": "stun:stun.1.google.com:19302"
			}]
	};
	var p2pConnection;
	var indicator;
	this.user = local;
	this.remote = peer;
	this.indicator = new Indicator();
	this.socket = socket;
}

PeerConnection.prototype.createVideo = function(peer, cb){
	var remotes = document.getElementById("remoteVideoContainer");
	if (remotes) {
		var remoteVideo = document.createElement("video");
		remoteVideo.className = "remoteVideo";
		remoteVideo.id = "theirConnection" + peer;
		this.theirVideoId = remoteVideo.id;
		remoteVideo.autoplay = true;
		remotes.appendChild(remoteVideo);
		this.theirVideo = document.getElementById(this.theirVideoId);
	}
	this.yourVideo = document.getElementById("yours");
	this.yourVideo.autoplay = true;
	cb();
}

PeerConnection.prototype.setupPeerConnection = function(peer, stream) {
	console.log("setupICEConnection: peer is " + peer);
	var self = this;
	// Setup stream listening
	this.p2pConnection.addStream(stream);
	this.p2pConnection.onaddstream = function (e) {
		self.theirVideo.src = window.URL.createObjectURL(e.stream);
	};

	// Setup ice handling
	this.p2pConnection.onicecandidate = function (event) {
		if (event.candidate) {
			console.log( "ICECandidate peer is " + peer);
			self.socket.emit("candidate", {
				type: "candidate",
				local: self.user,
				remote: peer,
				candidate: event.candidate
			});
		}
	};
}

PeerConnection.prototype.startConnection = function(peer, cb){
	var self = this;
	this.p2pConnection = new webkitRTCPeerConnection(this.configuration);
	console.log(this.p2pConnection);
	if (self.indicator.hasUserMedia()) {
		navigator.getUserMedia({ video: true, audio: false }, function (stream) {
			self.yourVideo.src = window.URL.createObjectURL(stream);
			if (self.indicator.hasRTCPeerConnection()) {
				self.setupPeerConnection(peer, stream);
				cb();
			} else {
				alert("Sorry, your browser does not support WebRTC.");
			}
		}, function (error) {
			console.log(error);
		});
	} else {
		alert("Sorry, your browser does not support WebRTC.");
	}
}

PeerConnection.prototype.makeOffer = function(cb)	{
	var self = this;
	this.p2pConnection.createOffer(function (offer) {
		self.p2pConnection.setLocalDescription(offer);
		cb(offer);
	}, function(error){
		console.log(error);
	});
}

PeerConnection.prototype.receiveOffer = function(data, cb){
	var self = this;
	var SDPOffer = new RTCSessionDescription(data.offer);
	this.p2pConnection.setRemoteDescription(SDPOffer, function(){
		self.p2pConnection.createAnswer(function (answer) {
			self.p2pConnection.setLocalDescription(answer);
			cb(answer);
		},function(error){
			console.log(error);
		});
	});
}

PeerConnection.prototype.receiveAnswer = function(data){
	var SDPAnswer = new RTCSessionDescription(data.answer);
	if (SDPAnswer == null){
		alert("data is empty");
	}else {
		console.log(SDPAnswer);
	}
	this.p2pConnection.setRemoteDescription(SDPAnswer);
	console.log(this.p2pConnection.localDescription);
	console.log(this.p2pConnection.remoteDescription);
}

PeerConnection.prototype.addCandidate = function(data) {
	this.p2pConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
}

module.exports = PeerConnection;
},{"./Indicator":2}],4:[function(require,module,exports){
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

	self.socket.on("createRoom", function(data){
		self.onCreateRoom(data);
	})

	self.socket.on("joinRoom", function(data){
		self.onJoinRoom(data);
	})

	self.socket.on("login", function(data) {
		if (data.status === "success"){
			self.allConnection = new AllConnection();
			self.user = data.userName;
			self.allConnection.init(data.userName, self.socket);
		} else if (data.status === "fail"){
			console.log = "User " + data.userName + " already exists";
		}
		self.onLogin(data);
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
}

WebRTC.prototype.onCreateRoom = function(data){};
WebRTC.prototype.onJoinRoom = function(data){};
WebRTC.prototype.onLogin = function(data){};

WebRTC.prototype.sendUserName = function(userName) {
	this.socket.emit("login", userName);
}

WebRTC.prototype.createRoom = function(roomId) {
	this.socket.emit("createRoom", roomId);
}

WebRTC.prototype.joinRoom = function(roomId) {
	this.socket.emit("joinRoom", roomId);
}

WebRTC.prototype.muteVideo = function(){
	webrtc.muteVideo();
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

module.exports = WebRTC;
},{"./AllConnection":1}]},{},[4])(4)
});
