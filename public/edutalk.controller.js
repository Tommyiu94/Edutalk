// edutalk.controller.js
angular
  .module('edutalk')
  .controller('mainController', mainController)
  .controller('staffController', staffController)
  .controller('studentController', studentController)
  .controller('roomController', roomController)
  .controller('chatController', chatController);

// Main Controller
function mainController($scope, $location, DataService, WebRTCService) {

  // Configure background color (body)
  document.body.style.backgroundColor="black";

  // Initialize WebRTC Service Object
  var webrtc = WebRTCService.initWebRTC('localhost:8888');

  // Responsive containers
  var x = window.innerHeight;
  document.getElementById("staffContainer").style.height = x + "px";
  document.getElementById("studentContainer").style.height = x + "px";

  // Open Staff/Student Login modal on click
  var openStaffModal = function(){
    $('#staffModal').openModal();
  };

  var openStudentModal = function(){
    $('#studentModal').openModal();
  };

  $scope.openStaffModal = openStaffModal;
  $scope.openStudentModal = openStudentModal;

  // Get username on user login
  onStaffLoginSuccess = function(){
    console.log('logging in ' + $scope.username);
    $location.path('/staff');
    $scope.$apply();
  };

  onStudentLoginSuccess = function(){
    console.log('logging in ' + $scope.username);
    $location.path('/student');
    $scope.$apply();
  };

  onLoginError = function(){
    alert('Bad username, please change to another one');
  };

  var staff_login = function(){
    $('#staffModal').closeModal(); // Close login modal
    DataService.setUsername($scope.username);
    webrtc.login($scope.username, onStaffLoginSuccess, onLoginError);
  };

  var student_login = function(){
    $('#studentModal').closeModal(); // Close login modal
    DataService.setUsername($scope.username);
    webrtc.login($scope.username, onStudentLoginSuccess, onLoginError);
  };

  $scope.staff_login = staff_login;
  $scope.student_login = student_login;
}

// Controller for staff.html
function staffController($scope, $location, DataService, WebRTCService) {

  // Configure background color (body)
  document.body.style.backgroundColor = "white";

  var joinRoom = function (roomID) {
    var webrtc = WebRTCService.getWebRTC();

    onJoinSuccess = function () {
      $location.path('/room/' + roomID);
      $scope.$apply(); // Use to apply the rediction
    };

    onJoinError = function () {
      alert("Unable to join the room");
    };

    onCreateSuccess = function () {
      $location.path('/room/' + roomID);
      $scope.$apply(); // Use to apply the rediction
    };

    onCreateError = function () {
      webrtc.joinRoom(roomID, onJoinSuccess, onJoinError);
    };

    webrtc.createRoom(roomID, onCreateSuccess, onCreateError);
  };

  $scope.joinRoom = joinRoom;
}

// Controller for student.html
function studentController($scope, $location, DataService, WebRTCService) {

  // Configure background color (body)
  document.body.style.backgroundColor = "white";

  var joinRoom = function (roomID) {
    var webrtc = WebRTCService.getWebRTC();

    onJoinSuccess = function () {
      $location.path('/room/' + roomID);
      $scope.$apply(); // Use to apply the rediction
    };

    onJoinError = function () {
      alert("Room does not exist!");
    };

    webrtc.joinRoom(roomID, onJoinSuccess, onJoinError);
  };

  $scope.joinRoom = joinRoom;
}

// Controller for room.html
function roomController($scope, DataService, WebRTCService, $routeParams) {

  // Configure background color (body)
  document.body.style.backgroundColor = "black";

  // Get WebRTC Service Object
  var username = DataService.getUsername();
  var roomID = $routeParams.roomID;
  var webrtc = WebRTCService.getWebRTC();

  webrtc.startCamera();

  // Responsive containers
  var x = window.innerHeight;
  document.getElementById("remoteVideoContainer").style.height = x + "px";

  // Video Functions
  var videoFullScreen = function () {
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
  };

  var video_on = true;
  var audio_on = true;
  var videoMute = function () {
    if (video_on === true) {
      webrtc.muteVideo();
      video_on = false;
    } else {
      webrtc.unmuteVideo();
      video_on = true;
    }
  };

  var audioMute = function () {
    if (audio_on === true) {
      webrtc.muteAudio();
      audio_on = false;
    } else {
      webrtc.unmuteAudio();
      audio_on = true;
    }
  };

  $scope.videoMute = videoMute;
  $scope.audioMute = audioMute;
  $scope.videoFullScreen = videoFullScreen;

  // Responsive Videos on Peer Video Added
  var noOfRemoteVideo = document.getElementById("remoteVideoContainer").childNodes.length;
  $("#remoteVideoContainer").bind("DOMNodeInserted", function () {
    var scrollHeight = document.getElementById("remoteVideoContainer").scrollHeight;
    var windowHeight = window.innerHeight;
    if (scrollHeight > windowHeight) {
      var x = document.getElementsByClassName("remote").length;
      for (i = 0; i < x; i++) {
        document.getElementsByClassName("remote")[i].setAttribute("class", "remote col s6 m6 l6");
      }
    }
  });

  // On user disconnect, remove peer video
  webrtc.onUserDisconnect = function (username) {
    var remoteVideoContainer = document.getElementById("remoteVideoContainer");
    var videoID = document.getElementById("peer_" + username);
    if (remoteVideoContainer && videoID) {
      remoteVideoContainer.removeChild(videoID);
    }

    // Responsive Videos on Peer Video Removed
    var scrollHeight = document.getElementById("remoteVideoContainer").scrollHeight;
    var windowHeight = window.innerHeight;
    if (scrollHeight == windowHeight) {
      var x = document.getElementsByClassName("remote").length;
      for (i = 0; i < x; i++) {
        document.getElementsByClassName("remote")[i].setAttribute("class", "remote col s12 m12 l12");
      }
    }
  };
}

// ChatBox functions in room.html
function chatController($scope, DataService, WebRTCService, $routeParams) {

  // Get WebRTC Service Object
  var username = DataService.getUsername();
  var roomID = $routeParams.roomID;
  var webrtc = WebRTCService.getWebRTC();

  // Welcome message in chatbox
  var welcomeMessage = "You are now in room " + roomID + ".";
  var messages = [welcomeMessage];

  // Toggle on/off Chat Window
  var chatWindow = true; // is hidden
  var showChat = function () {
    if (chatWindow == true) {
      $("#chatWindow").show();
      chatWindow = false;
    }
    else {
      $("#chatWindow").hide();
      chatWindow = true;
    }
  };

  $scope.showChat = showChat;

  // Capture message input
  var sendMessage = function () {
    var message = $("#chatInput").val();
    if (message.length != 0) {
      webrtc.sendChatMessage(message);
    }
  };
  $scope.sendMessage = sendMessage;

  // On Message Sent
  webrtc.onChatMessage = function (chatMessageData) {

    if (chatMessageData.action == "chat") {
      var messageFormat = chatMessageData.sender + ":" + " " + chatMessageData.content;
      messages.push(messageFormat);
      $scope.$apply(); // to let Angular know that scope has changed (for ng-repeat)
    }

    // Let people know user have joined
    if (chatMessageData.action == "join") {
      var onUserJoinMessage = chatMessageData.sender + " has joined the room.";
      messages.push(onUserJoinMessage);
      $scope.$apply();
    }

    if (chatMessageData.action == "leave") {
      var onUserLeaveMessage = chatMessageData.sender + " has left the room.";
      messages.push(onUserLeaveMessage);
      $scope.$apply();
    }

    // Clear message input box on send
    $('#chatInput').val('');

    // Notification animation when chatbox is disabled
    if (chatWindow == true) {
      var blink = $("#chatButton");
      var blinkInterval = setInterval(function () {
        if (chatWindow == false) {
          clearInterval(blinkInterval);
          setTimeout( function() {
            blink.toggleClass("teal");
            console.log("hi");
          }, 2000);
        }
        blink.toggleClass("cyan accent-3");
      }, 600);
    }

    // Keep scroll bar on the bottom
    var tableBody = document.getElementById('tableBody');
    if (tableBody.scrollHeight > tableBody.clientHeight) {
      tableBody.scrollTop = tableBody.scrollHeight - tableBody.clientHeight;
    }
  };
  $scope.messages = messages;

  // Responsive chatbox
  var x = window.innerHeight;
  document.getElementById("tableBody").style.maxHeight = x + "px";
  var y = $("#chatWindow").width();
  $scope.messageWidth = y + "px";

  window.onresize = function (event) {
    var y = $("#chatWindow").width();
    $scope.messageWidth = y + "px";
    $scope.$apply();
  };
}

