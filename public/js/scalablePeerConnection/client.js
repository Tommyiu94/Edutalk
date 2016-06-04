webrtc = new WebRTC("localhost:8080");

function sendName(e){
	if (e.keyCode == 13) {
		var userName = document.getElementById("login").value;
		if (userName.length == 0)
			document.getElementById("feedback").value = "Input a valid userName";
		else {
			webrtc.login(userName, function(){
				document.getElementById("feedback").value = "You successfully login ";
			}, function(){
				document.getElementById("feedback").value = "Current account already exists" ;
			});
			document.getElementById("login").value = "";
		}
	}
}

function cRoom(e){
	if (e.keyCode == 13) {
		var roomId = document.getElementById("createroom").value;
		if (roomId.length == 0)
			document.getElementById("feedback").value = "Input a valid roomId";
		else {
			webrtc.createRoom(roomId, function(){
				document.getElementById("feedback").value = "You successfully created Room ";
			}, function(){
				document.getElementById("feedback").value = "Current roomId already exists" ;
			});
			document.getElementById("createroom").value = "";
		}
	}
}

function jRoom(e){	
	if (e.keyCode == 13) {
		var roomId = document.getElementById("joinroom").value;
		if (roomId.length == 0)
			document.getElementById("feedback").value = "Input a valid roomId";
		else {
			webrtc.joinRoom(roomId, function(){
				document.getElementById("feedback").value = "You successfully joined Room ";
			}, function(){
				document.getElementById("feedback").value = "Room does not exists" ;
			});
			document.getElementById("joinroom").value = "";
		}
	}
}

function sendCommand(e){
	if (e.keyCode == 13) {
		var command = document.getElementById("command").value;
		if (command.length == 0)
			document.getElementById("feedback").value = "Input a valid command";
		else {
			webrtc.sendCommand(command, function(){
				document.getElementById("feedback").value = "You successfully sent a command";
			}, function(){
				document.getElementById("feedback").value = "Input a valid command" ;
			});
			document.getElementById("command").value = "";
		}
	}
}