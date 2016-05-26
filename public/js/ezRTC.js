webrtc = new WebRTC();
webrtc.onJoinRoom = function(data) {
  if (data.status === "success") {
    setLocal(user);
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
