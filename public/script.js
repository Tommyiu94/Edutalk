var edutalkApp = angular.module('edutalkApp', ['ngRoute']);

// Route Configuration
edutalkApp.config(function($routeProvider, $locationProvider) {
  $routeProvider

    // route for Home page
    .when('/', {
      templateUrl : 'pages/home.html',
      controller  : 'mainController'
    })

    // route for Staff landing page
    .when('/staff', {
      templateUrl : 'pages/staff.html',
      controller  : 'staffController'
    })

    // route for Student landing page
    .when('/student', {
      templateUrl : 'pages/student.html',
      controller  : 'studentController'
    })

    // route for Video Conferencing Room
    .when('/room/:roomID', {
      templateUrl : 'pages/room.html',
      controller  : 'roomController'
    })

    // route for BroadCast Demo
    .when('/broadcastDemo', {
      templateUrl : 'pages/broadcastDemo.html',
      controller  : 'broadcastController'
    });

    $locationProvider.html5Mode(true);
});

edutalkApp.factory('WebRTCService', function(){
  var webrtc = {};

  return {
  	getWebRTC: function(){ return webrtc },
		initWebRTC: function(signal){
			webrtc = new WebRTC(signal);
			return webrtc;
		}
  }
});

// Function for data sharing between controllers
edutalkApp.factory('DataService', function() {
  var username = '';

  return {
    getUsername: function(){
      return username;
    },

    setUsername: function(newUsername) {
      username = newUsername;
    }
  }
});

edutalkApp.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
});

// Controller for home.html
edutalkApp.controller('mainController', function($scope, $location, DataService, WebRTCService) {

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
		$scope.$apply(); // Use to apply the rediction
  };

  onStudentLoginSuccess = function(){
		console.log('logging in ' + $scope.username);
		$location.path('/student');
		$scope.$apply(); // Use to apply the rediction
  };

  onLoginError = function(){
  	alert('Bad username, please change to another one');
  };

	var staff_login = function(){
    DataService.setUsername($scope.username);
		webrtc.login($scope.username, onStaffLoginSuccess, onLoginError);
  };

  var student_login = function(){
    DataService.setUsername($scope.username);
		webrtc.login($scope.username, onStudentLoginSuccess, onLoginError);
  };

  $scope.staff_login = staff_login;
  $scope.student_login = student_login;

});

// Controller for staff.html
edutalkApp.controller('staffController', function($scope, $location, DataService, WebRTCService) {

  // Configure background color (body)
  document.body.style.backgroundColor="white";

  var joinRoom = function(roomID) {
  	var webrtc = WebRTCService.getWebRTC();

		onJoinSuccess = function() {
	  	$location.path('/room/' + roomID);
			$scope.$apply(); // Use to apply the rediction
		};

		onJoinError = function() {
			alert("Unable to join the room");
		};

		onCreateSuccess = function() {
	  	$location.path('/room/' + roomID);
			$scope.$apply(); // Use to apply the rediction
		};

		onCreateError = function() {
			webrtc.joinRoom(roomID, onJoinSuccess, onJoinError); 
		};

	  webrtc.createRoom(roomID, onCreateSuccess, onCreateError);
  };

  $scope.joinRoom = joinRoom;

});

// Controller for student.html
edutalkApp.controller('studentController', function($scope, $location, DataService, WebRTCService) {

  // Configure background color (body)
  document.body.style.backgroundColor="white";

  var joinRoom = function(roomID) {
		var webrtc = WebRTCService.getWebRTC();

    onJoinSuccess = function() {
      $location.path('/room/' + roomID);
      $scope.$apply(); // Use to apply the rediction
    };

    onJoinError = function() {
      alert("Room does not exist!");
    };

    webrtc.joinRoom(roomID, onJoinSuccess, onJoinError);
  };

  $scope.joinRoom = joinRoom;

});

// Controller for room.html
edutalkApp.controller('roomController', function($scope, DataService, WebRTCService, $routeParams) {

  // Configure background color (body)
  document.body.style.backgroundColor="black";

  // Get WebRTC Service Object
  var username = DataService.getUsername();
  var roomID = $routeParams.roomID;
  var webrtc = WebRTCService.getWebRTC();

	webrtc.startCamera();

  // Responsive containers
  var x = window.innerHeight;
  document.getElementById("remoteVideoContainer").style.height = x + "px";

  // Video Functions
  var videoFullScreen = function() {
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
	var videoMute = function(){
		if (video_on === true){
			webrtc.muteVideo();
			video_on = false;
		} else {
			webrtc.unmuteVideo();
			video_on = true;
		}
	};

	var audioMute = function(){
		if (audio_on === true){
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
  $("#remoteVideoContainer").bind("DOMNodeInserted",function() {
    var scrollHeight = document.getElementById("remoteVideoContainer").scrollHeight;
    var windowHeight = window.innerHeight;
    if (scrollHeight > windowHeight) {
      document.styleSheets[3].cssRules[6].style.width = "49%";
    }
    // Indicate user has joined in chat window

  });

  // On user disconnect, remove peer video
  webrtc.onUserDisconnect = function(username) {
    var remoteVideoContainer = document.getElementById("remoteVideoContainer");
    var videoID = document.getElementById("peer_" + username);
    if (remoteVideoContainer && videoID) {
      remoteVideoContainer.removeChild(videoID);
    }

    // Responsive Videos on Peer Video Removed
    var scrollHeight = document.getElementById("remoteVideoContainer").scrollHeight;
    var windowHeight = window.innerHeight;
    if (scrollHeight == windowHeight) {
      document.styleSheets[2].cssRules[6].style.width = "98%";
    }
  };

  // ChatBox functions
  // Welcome message in chatbox
  var welcomeMessage = "You are now in room " + roomID + ".";
  var messages = [welcomeMessage];

  // Toggle on/off Chat Window
  var chatWindow = true; // is hidden
  var showChat = function() {
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
  var sendMessage = function() {
    var message = $("#chatInput").val();
    if (message.length != 0) {
      webrtc.sendChatMessage(message);
    }
  };
  $scope.sendMessage = sendMessage;

  // On Message Sent
  webrtc.onChatMessage = function(chatMessageData) {

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
    /* if (chatWindow == true) { //chatWindow is hidden
      setInterval(function () {

        var red = document.getElementById("chatButton").setAttribute("class", "red waves-effect waves-light btn");
        var redFlag = true;

        if (redFlag)
        var blue = document.getElementById("chatButton").setAttribute("class", "blue waves-effect waves-light btn");

      }, 1000);
    } */

    // Keep scroll bar on the bottom
    var tableBody = document.getElementById('tableBody');
    if(tableBody.scrollHeight > tableBody.clientHeight) {
      tableBody.scrollTop = tableBody.scrollHeight - tableBody.clientHeight;
    }
  };
  $scope.messages = messages;



  // Responsive chatbox
  var x = window.innerHeight;
  document.getElementById("tableBody").style.maxHeight = x + "px";

  // Room Controller END
});

edutalkApp.controller('broadcastController', function() {

  // Configure background color (body)
  document.body.style.backgroundColor="white";
});


