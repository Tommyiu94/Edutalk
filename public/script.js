var scotchApp = angular.module('scotchApp', ['ngRoute']);

// Route Configuration
scotchApp.config(function($routeProvider, $locationProvider) {
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

  // $locationProvider.html5Mode(true);
});

scotchApp.controller('mainController', function($scope) {

  // Responsive Containers
  var x = window.innerHeight;
  document.getElementById("staffContainer").style.height = x + "px";
  document.getElementById("studentContainer").style.height = x + "px";

  // Open Staff/Student Login modal on click
  var openStaffModal = function(){
    $('#staffModal').openModal();
  };
  var openStudentModal = function(){
    $('#studentModal').openModal();
  }
  $scope.openStaffModal = openStaffModal;
  $scope.openStudentModal = openStudentModal;

});