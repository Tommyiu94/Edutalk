$("#fullscreen").click(function() { // Toggle on/off for video fullscreen
  if (document.getElementById("fullscreen").getAttribute("fullscreenMode") == "disabled") {
    document.getElementById("fullscreen").setAttribute("fullscreenMode", "enabled");
    if (!document.fullscreenElement && !document.msFullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
      if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
      } else if (document.body.msRequestFullscreen) {
        document.body.msRequestFullscreen();
      } else if (document.body.mozRequestFullScreen) {
        document.body.mozRequestFullScreen();
      } else if (document.body.webkitRequestFullscreen) {
        document.body.webkitRequestFullscreen();
      }
    }
  }
  else if (document.getElementById("fullscreen").getAttribute("fullscreenMode") == "enabled") {
    document.getElementById("fullscreen").setAttribute("fullscreenMode", "disabled");
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

$("#offCam").click(function() { // Toggle on/off for video
  if (document.getElementById("offCam").getAttribute("videoMute") == "disabled") {
    document.getElementById("offCam").setAttribute("videoMute", "enabled");
    webrtc.pauseVideo(localVideo);
  }
  else if (document.getElementById("offCam").getAttribute("videoMute") == "enabled") {
    document.getElementById("offCam").setAttribute("videoMute", "disabled");
    webrtc.resumeVideo(localVideo);
  }
});

$("#audio").click(function() { // Toggle on/off for video audio
  if (document.getElementById("audio").getAttribute("audioMute") == "disabled") {
    document.getElementById("audio").setAttribute("audioMute", "enabled");
    webrtc.mute(localVideo);
  }
  else if (document.getElementById("audio").getAttribute("audioMute") == "enabled") {
    document.getElementById("audio").setAttribute("audioMute", "disabled");
    webrtc.mute(localVideo);
  }
});
