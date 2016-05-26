var webrtc = new SimpleWebRTC({
  // the id/element dom element that will hold "our" video
  localVideoEl: 'localVideo',
  // the id/element dom element that will hold remote videos
  remoteVideosEl: '',
  // immediately ask for camera access
  autoRequestMedia: true,
  // url: '172.23.155.42:8888'
  url: 'localhost:8888'
});
// we have to wait until it's ready
webrtc.on('readyToCall', function () {
// you can name it anything
var parts = location.pathname.split("/");
var roomID = parts[parts.length - 1];
webrtc.joinRoom(roomID);

// a peer video has been added
});
webrtc.on('videoAdded', function (video, peer) {
  console.log('video added', peer);
  var remotes = document.getElementById('remoteVideoContainer');
  if (remotes) {
     var container = document.createElement('div');
     container.className = 'remoteVideo';
     container.id = 'container_' + webrtc.getDomId(peer);
     container.appendChild(video);
     // suppress contextmenu
     video.oncontextmenu = function () { return false; };
     remotes.appendChild(container);
  }
  // Responsive functions
  var scrollHeight = document.getElementById("remoteVideoContainer").scrollHeight;
  var windowHeight = window.innerHeight;
  if (scrollHeight > windowHeight) {
    document.styleSheets[2].cssRules[6].style.width = "49%";
  }
});

// a peer video was removed
webrtc.on('videoRemoved', function (video, peer) {
  console.log('video removed ', peer);
  var remotes = document.getElementById('remoteVideoContainer');
  var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
  if (remotes && el) {
    remotes.removeChild(el);
  }
  // Responsive functions
  var scrollHeight = document.getElementById("remoteVideoContainer").scrollHeight;
  var windowHeight = window.innerHeight;
  if (scrollHeight == windowHeight) {
    document.styleSheets[2].cssRules[6].style.width = "98%";
  }
});
