barApp.controller('loginController', function($route, $scope, $rootScope, $location, utilityService) {
  $scope.emailId = "";
  $scope.password = "";
  $scope.processLogin = function() {
    // todo : make an api call to generate auth token
    utilityService.setCookie({'authToken' : 'abcdefghijklmnop'});
    $location.path('/dashboard');
  }
})
