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

// Controller for home.html
edutalkApp.controller('mainController', function($scope, DataService, WebRTCService) {

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
  var login = function(){
    DataService.setUsername($scope.username);
	console.log('logging in ' + $scope.username);
	webrtc.sendUserName($scope.username);
  };

  $scope.login = login;

});

// Controller for staff.html
edutalkApp.controller('staffController', function($scope, $location, DataService, WebRTCService) {

  // Configure background color (body)
  document.body.style.backgroundColor="white";

  //TODO: Error Handling of joining room
  var joinRoom = function(roomID){
	  console.log(roomID);
  	var webrtc = WebRTCService.getWebRTC();
	  webrtc.createRoom(roomID);
	  $location.path('/room/' + roomID);
  };

  $scope.joinRoom = joinRoom;

});

// Controller for student.html
edutalkApp.controller('studentController', function($scope, $location, DataService, WebRTCService) {

  // Configure background color (body)
  document.body.style.backgroundColor="white";

  var joinRoom = function(roomID) {
    console.log(roomID);
    var webrtc = WebRTCService.getWebRTC();
    webrtc.createRoom(roomID);
    $location.path('/room/' + roomID);
  };

  $scope.joinRoom = joinRoom;

});

// Controller for room.html
edutalkApp.controller('roomController', function($scope, DataService, WebRTCService, $routeParams) {

  // Configure background color (body)
  document.body.style.backgroundColor="black";

  // Get WebRTC Service Object
  var webrtc = WebRTCService.getWebRTC();
  var username = DataService.getUsername();
  var roomID = $routeParams.roomID;

  webrtc.joinRoom(roomID);

  // Responsive containers
  var x = window.innerHeight;
  document.getElementById("remoteVideoContainer").style.height = x + "px";

  // Video Functions

  // Responsive Videos on Peer Video Added
  var noOfRemoteVideo = document.getElementById("remoteVideoContainer").childNodes.length;
  $("#remoteVideoContainer").bind("DOMNodeInserted",function() {
    var scrollHeight = document.getElementById("remoteVideoContainer").scrollHeight;
    var windowHeight = window.innerHeight;
    if (scrollHeight > windowHeight) {
      document.styleSheets[3].cssRules[6].style.width = "49%";
    }
  });

  // On Peer Video Removed
  /* var scrollHeight = document.getElementById("remoteVideoContainer").scrollHeight;
   var windowHeight = window.innerHeight;
   if (scrollHeight == windowHeight) {
   document.styleSheets[2].cssRules[6].style.width = "98%";
   } */

});

edutalkApp.controller('broadcastController', function() {

  // Configure background color (body)
  document.body.style.backgroundColor="black";


});


