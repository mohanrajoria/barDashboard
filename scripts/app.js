var barApp = angular.module("barApp", [
  'ngRoute',
  'helper',
  'ui.bootstrap'
]);

barApp.controller('mainController', function($route, $scope, $rootScope, $location, utilityService) {
  // let authTokenObj = utilityService.getCookie(['barAuthToken']);
  // if(authTokenObj && authTokenObj['barAuthToken']) {
  //   $location.path('/dashboard');
  // } else {
  //   $location.path('/login');
  // }
})

barApp.config(function($routeProvider) {
  $routeProvider
  .when("/login", {
      templateUrl : "../views/login.html",
      controller : "loginController",
  })
  .when("/dashboard", {
      templateUrl : "../views/dashboard.html",
      controller : "dashboardController",
  })
});
