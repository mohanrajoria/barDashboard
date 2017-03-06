var barApp = angular.module("barApp", ['ngRoute']);

barApp.controller('mainController', function($route, $scope, $rootScope, $location, utilities) {
  let authTokenObj = utilities.getCookie(['authToken']);
  if(authTokenObj && authTokenObj['authToken']) {
    $location.path('/dashboard');
  } else {
    $location.path('/login');
  }
})

barApp.config(function($routeProvider) {
  $routeProvider
  .when("/", {
      templateUrl : "../index.html",
      controller : "mainController"
  })
  .when("/login", {
      templateUrl : "../views/login.html",
      controller : "loginController"
  })
  .when("/dashboard", {
      templateUrl : "../views/dashboard.html",
      controller : "dashboardController"
  })
});
