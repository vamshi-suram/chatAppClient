// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('chatApp', ['ionic', 'chatApp.router', 'chatApp.services'])


.controller('mainController', ['$rootScope', '$scope', '$state', 'userService',  function($rootScope, $scope, $state, userService) {

  if ($rootScope.users === undefined) {
    $rootScope.users = userService.onlineUsers();
  }

  $scope.user = $rootScope.currentUser || { firstname : "", lastname: ""};
  $scope.users = $rootScope.users;
  $scope.chatWith = $rootScope.chatWith;

  $scope.isHome = function () {
    if (($state.current.name === "register") || ($state.current.name === "users")) {
      return true;
    } else {
      return false;
    }
  };

  $scope.goBack = function () {
    $state.go($rootScope.previousState);
  };

  $scope.registerUser = function () {
    $rootScope.currentUser = $scope.user;
    $rootScope.users.push({firstname: $scope.user.firstname, lastname: $scope.user.lastname});
    $state.go("users");
  };

  $scope.chatWithUser = function (user) {
    $rootScope.chatWith = user;
    $state.go("chat");
  };

$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
    $rootScope.previousState = from.name;
    $rootScope.currentState = to.name;
});



}])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
