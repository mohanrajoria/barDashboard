barApp.service('utilities', function($route, $scope, $rootScope) {
  let getCookie = (cookieNames) => {
    let cookie = document.cookie;
    // todo : find cookieNames in cookie and return an object
    return {'authToken' : 'abcdefghijklmnop'};
  }

  let setCookie = (cookieObj) => {
    Object.keys(cookieObj).forEach(function(key, index) {
      document.cookie = key + "=" + cookieObj[key] + ";";
    })
  }

  let expireCookie = (cookieNames) => {
    if(cookieNames && cookieNames.length) {
      for(let i = 0; i < cookieNames.length; i++) {
        document.cookie = cookieNames[i] + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      }
    }
  }

  return {
    getCookie : getCookie,
    setCookie : setCookie,
    removeCookie : expireCookie
  }
})
