barApp.controller('loginController', function($route, $scope, $rootScope, $location, utilities) {
  $scope.emailId = "";
  $scope.password = "";
  $scope.processLogin = function() {
    // todo : make an api call to generate auth token
    utilities.setCookie({'authToken' : 'abcdefghijklmnop'});
    $location.path('/dashboard');
  }
})
