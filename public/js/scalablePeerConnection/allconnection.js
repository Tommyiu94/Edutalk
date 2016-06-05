var PeerConnection = require('./peerconnection.js');
var Indicator = require('./indicator.js');

function AllConnection(){
	var local;
	var stream;
	var socket;
	this.connection = {};
	this.indicator = new Indicator();
	this.localVideo = document.getElementById("localVideo");
	this.localVideo.autoplay = true;
}

//initialise the setup of AllConnection
AllConnection.prototype.init = function(user, socket){
	this.local = user;
	this.socket = socket;
}

//initialise the setup of own camera
AllConnection.prototype.initCamera = function(cb){
	if (!this.stream){
		var self = this;
		if (this.indicator.hasUserMedia()) {
			navigator.getUserMedia({ video: true, audio: true }, function (stream) {
				self.localVideo.src = window.URL.createObjectURL(stream);
				self.stream = stream;
				console.log("stream is ");
				console.log(stream);
				cb();
			}, function (error) {
				console.log(error);
			});
		} else {
			alert("Sorry, your browser does not support WebRTC.");
		}
	}
	else {
		cb();
	}
}

//initialise a connection with peers
AllConnection.prototype.initConnection = function(peer){
	var self = this;
	self.connection[peer] = new PeerConnection(self.local, peer, self.socket, self.localVideo);
	self.initCamera(function(){
		self.connection[peer].startConnection(function(){
			console.log("initiate connection");
			self.connection[peer].hostSetupPeerConnection(peer, self.stream, function(){
				self.connection[peer].makeOffer( function(offer){
					console.log("send offer to " + peer);
					self.socket.emit("SDPOffer", {
						type: "SDPOffer",
						local: self.local,
						remote: peer,
						offer: offer
					});
				});
			});
		});
	});
}

//when receive an spd offer
AllConnection.prototype.onOffer = function(sdpOffer){
	var self = this;
	peer = sdpOffer.remote;
	self.connection[peer] = new PeerConnection(self.local, peer, self.socket, self.localVideo);
	self.connection[peer].startConnection(function(){
		self.connection[peer].visitorSetupPeerConnection(peer, self.stream, function(){
			self.connection[sdpOffer.remote].receiveOffer(sdpOffer, function(sdpAnswer){
				self.socket.emit("SDPAnswer", {
					type: "SDPAnswer",
					local: self.local,
					remote: sdpOffer.remote,
					answer: sdpAnswer
				});
			});
		});
	});
}

//when receive an spd answer
AllConnection.prototype.onAnswer = function(sdpAnswer){
	this.connection[sdpAnswer.remote].receiveAnswer(sdpAnswer);
}

//when receive an ice candidate
AllConnection.prototype.onCandidate = function(iceCandidate){
	this.connection[iceCandidate.remote].addCandidate(iceCandidate);
}

module.exports = AllConnection;
