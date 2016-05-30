## How to use WebRTC Library

### To initialize
```javascript
webrtc = new WebRTC("localhost:8080");
```

### To create a new room
```javascript
webrtc.createRoom(roomName);
```

## Callback after creating room
```javascript
webrtc.onCreateRoom = function(data) {
	if (data.status === "success") {
		document.getElementById("feedback").value = "You successfully created Room "
			+ data.room;
	} else if (data.status === "fail") {
		document.getElementById("feedback").value = "Room " + data.room
		+ " already exists";
	}
};

```
### To join a room
```javascript
webrtc.joinRoom(command);
```

### Callback after joining room
```javascript
webrtc.onJoinRoom = function(data) {
	if (data.status === "success") {
	} else if (data.status === "fail") {
		document.getElementById("feedback").value = "Room " + data.room
		+ " does not exist";
	}
};
```


### To login
```javascript
webrtc.sendUserName(username);
```

### Callback after logging in
```javascript
webrtc.onLogin = function(data) {
	if (data.status === "success") {
		document.getElementById("feedback").value = "You successfully login";
	} else if (data.status === "fail") {
		document.getElementById("feedback").value = "Current account already exists";
	}
};
```
### Mute
```javascript
webrtc.muteVideo();
webrtc.muteAudio();
webrtc.unmuteVideo();
webrtc.unmuteVideo();
```

### To get the information of the peers in the room
```javascript
webrtc.getPeers();
```
