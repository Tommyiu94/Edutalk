var Indicator = require('./Indicator');
var socket = io('http://localhost:8080');

function PeerConnection(local, peer){
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
}

PeerConnection.prototype.createVideo = function(peer, cb){
	var remotes = document.getElementById("remoteVideoContainer");
	if (remotes) {
		var remoteVideo = document.createElement("video");
		remoteVideo.className = "remoteVideo";
		remoteVideo.id = "theirConnection" + peer;
		this.theirVideoId = remoteVideo.id;
		remoteVideo.autoPlay = true;
		remotes.appendChild(remoteVideo);
		this.theirVideo = document.getElementById(this.theirVideoId);
	}
	this.yourVideo = document.getElementById("yours");
	cb();
}

PeerConnection.prototype.setupPeerConnection = function(peer, stream) {
	var self = this;
	// Setup stream listening
	this.p2pConnection.addStream(stream);
	this.p2pConnection.onaddstream = function (e) {
		self.theirVideo.src = window.URL.createObjectURL(e.stream);
	};

	// Setup ice handling
	this.p2pConnection.onicecandidate = function (event) {
		if (event.candidate) {
			socket.emit("candidate", {
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