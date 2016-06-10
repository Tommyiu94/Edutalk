// edutalk.route.js
// Route Configuration
angular
  .module('edutalk')
  .config(function($routeProvider, $locationProvider) {
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

      // route for student room
      .when('/studentRoom/:roomID', {
        templateUrl : 'pages/room.html',
        controller  : 'studentRoomController'
    })

    $locationProvider.html5Mode(true);
  });