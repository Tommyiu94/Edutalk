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
  //Get WebRTC Service Object

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
edutalkApp.controller('studentController', function($scope, DataService) {
  // get username from DataService (.factory)
  var username = DataService.getUsername();
  $scope.username = username;

});

// Controller for room.html
edutalkApp.controller('roomController', function($scope, DataService, WebRTCService, $routeParams) {
  // Get WebRTC Service Object
  var webrtc = WebRTCService.getWebRTC();
  var username = DataService.getUsername();
  var roomID = $routeParams.roomID;

  webrtc.joinRoom(roomID);

  // Responsive containers
  var x = window.innerHeight;
  document.getElementById("remoteVideoContainer").style.height = x + "px";

});


