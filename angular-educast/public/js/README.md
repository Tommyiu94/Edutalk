## How to use WebRTC Library

### To initialize
```javascript
webrtc = new WebRTC("localhost:8080");
```

### To create a new room with callback
```javascript
webrtc.createRoom(roomName, successCallback, failCallback);
```

### To join a room with callback
```javascript
webrtc.joinRoom(command, successCallback, failCallback);
```

### To login with callback
```javascript
webrtc.login(username, successCallback, failCallback);
```

### Responde when a specific user is disconnected
```javascript
webrtc.onUserDisconnect = function(userDisconnected){
}
```

### To start the local camera
```javascript
webrtc.startCamera();
```

### To load local stream
Set your local video element id 
```html
<video id="localVideo"></video>
```

### To chat with other in message box
```javascript
webrtc.sendChatMessage(message);
```
```javascript
WebRTC.prototype.onChatMessage(chatMessageData);
//chatMessageData contain sender and content 
```


### To load remote streams
Set your remote video container div 
```html
<div id="remoteVideoContainer"></div>
```
All of remote video elements will have class "remote"
```html
<video class="remote"></video>
```


### Mute
```javascript
webrtc.muteVideo();//working on
webrtc.muteAudio();//working on
webrtc.unmuteVideo();
webrtc.unmuteVideo();
```

### To get the information of the peers in the room
```javascript
webrtc.getPeers(callback(peerListData));

sample use:
webrtc.getPeers(function(peerListData){		
	document.getElementById("peer").value = "";
	var peerList = "";
	for (var i in peerListData.allUser ) {
		peerList += peerListData.allUser[i] + " ";
	}
	document.getElementById("peer").value = peerList;
});
```
