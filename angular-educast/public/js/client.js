webrtc = new WebRTC("localhost:8080");

webrtc.onJoinRoom = function(data) {
	if (data.status === "success") {
	} else if (data.status === "fail") {
		document.getElementById("feedback").value = "Room " + data.room
		+ " does not exist";
	}
};

webrtc.onCreateRoom = function(data) {
	if (data.status === "success") {
		document.getElementById("feedback").value = "You successfully created Room "
			+ data.room;
	} else if (data.status === "fail") {
		document.getElementById("feedback").value = "Room " + data.room
		+ " already exists";
	}
};

webrtc.onLogin = function(data) {
	if (data.status === "success") {
		document.getElementById("feedback").value = "You successfully login";
	} else if (data.status === "fail") {
		document.getElementById("feedback").value = "Current account already exists";
	}
};

function muteVideo(){
	webrtc.muteVideo();
}
function muteAudio(){
	webrtc.muteAudio();
}
function unmuteVideo(){
	webrtc.unmuteVideo();
}
function unmuteAudio(){
	webrtc.unmuteAudio();
}


function sendName(e){
	if (e.keyCode == 13) {
		var command = document.getElementById("command").value;
		if (command.length == 0)
			document.getElementById("feedback").value = "Input a valid command";
		else {
			console.log(command);
			webrtc.sendUserName(command);
			document.getElementById("command").value = "";
		}
	}
}

function cRoom(e){
	if (e.keyCode == 13) {
		var command = document.getElementById("createroom").value;
		if (command.length == 0)
			document.getElementById("feedback").value = "Input a valid command";
		else {
			webrtc.createRoom(command);
			document.getElementById("createroom").value = "";
		}
	}
}

function jRoom(e){	
	if (e.keyCode == 13) {
		var command = document.getElementById("joinroom").value;
		if (command.length == 0)
			document.getElementById("feedback").value = "Input a valid command";
		else {
			webrtc.joinRoom(command);
			document.getElementById("joinroom").value = "";
		}
	}
}

function getPeers(){	
	webrtc.getPeers();
}