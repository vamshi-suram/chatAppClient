// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('chatApp', ['ionic', 'chatApp.router', 'chatApp.services', 'chatApp.networking'])


.controller('mainController', ['$rootScope', '$scope', '$state', 'userService', 'WebSocketService', function($rootScope, $scope, $state, userService, ws) {

  if ($state.current.name === "users") {
    userService.onlineUsers().then(
      function (data) {
        $rootScope.users = data.users;
      },
      function (error) {
        console.log(error);
      });
  }
  
  ws.on("login-broadcast", function (data) {
    var user = {};
    user.userid = data.userid;
    user.firstname = data.firstname;
    user.lastname = data.lastname;
    $rootScope.$apply(function () {
      if (user.userid !== $rootScope.currentUser.userid) {
        $rootScope.users.push(user);
      }
    });
  });


  ws.on("logout-broadcast", function (data) {
    var user = {};
    user.id = data.userid;
    user.firstname = data.firstname;
    user.lastname = data.lastname;
    $rootScope.$apply(function () {
      if (user.id !== $rootScope.currentUser.userid) {
        var newArr = [];
        ($rootScope.users).forEach(function (rootScopeUser, i) {
          if (user.id === rootScopeUser.userid) {
          
          } else {
            newArr.push(rootScopeUser);
          }
        });
        $rootScope.users = newArr;
      }
    });
  });

  $scope.user = $rootScope.currentUser || { firstname : "", lastname: ""};
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
    $rootScope.users = [];
    userService.loginUser($scope.user.firstname, $scope.user.lastname).then(
      function (data) {
        console.log("Logged in", data);
      },
      function (error) {
        console.log(error);
      });
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
