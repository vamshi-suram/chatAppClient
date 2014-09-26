// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('chatApp', ['ionic', 'chatApp.router', 'chatApp.services', 'chatApp.networking'])


.controller('mainController', ['$rootScope', '$scope', '$state', 'userService', 'WebSocketService', function($rootScope, $scope, $state, userService, websocketService) {

  if ($state.current.name === "users") {
    userService.onlineUsers().then(
      function (data) {
        (data.users).forEach(function (user) {
          if (user.userId !== $rootScope.currentUser.userId) {
            $rootScope.messageList[user.userId] = [];
            $rootScope.users.push(user);
          }
        });
      },
      function (error) {
        console.log(error);
      });
  }

  
  websocketService.on("login-broadcast", function (data) {
    var user = {};
    user.userId = data.userId;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    $rootScope.$apply(function () {
      if (user.userId !== $rootScope.currentUser.userId) {
        $rootScope.messageList[user.userId] = []; // Initialize message list.
        $rootScope.users.push(user);
      }
    });
  });

  if ($scope.user === undefined) {
    $scope.user = {
      "userId" : "",
      "firstName" : "",
      "lastName" : ""
    };
  }

  if ($scope.message === undefined) {
    $scope.message = "";
  }

  if ($rootScope.messageList === undefined) {
    $rootScope.messageList = {};
  }

  websocketService.on("logout-broadcast", function (data) {
    var user = {};
    user.id = data.userId;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    $rootScope.$apply(function () {
      if (user.id !== $rootScope.currentUser.userId) {
        var newArr = [];
        ($rootScope.users).forEach(function (rootScopeUser, i) {
          if (user.id === rootScopeUser.userId) {
          
          } else {
            newArr.push(rootScopeUser);
          }
        });
        $rootScope.users = newArr;
      }
    });
  });

  websocketService.on("private-message", function (data) {
    // Find the user who sent the message.
    var fromId = data.from;
    ($rootScope.users).forEach(function (rootScopeUser, i) {
      if (data.from === rootScopeUser.userId) {
        $rootScope.chatWith = rootScopeUser;
        $rootScope.messageList[data.from].push(data.message); // Add message.
        $state.go("chat");
      }
    });
  });

  $scope.chatWith = $rootScope.chatWith;
  $scope.currentUser = $rootScope.currentUser;

  if ($scope.chatWith !== undefined) {
    $scope.currentMessageList = $rootScope.messageList[$scope.chatWith["userId"]];
  }

  $scope.isHome = function () {
    if ($state.current.name === "register") {
      return true;
    } else {
      return false;
    }
  };

  $scope.sendMessage = function (message) {
    $rootScope.messageList[$scope.chatWith.userId].push(message);
    userService.sendMessage($scope.currentUser, $scope.chatWith, message);
  };

  $scope.goBack = function () {
    $state.go($rootScope.previousState);
  };

  $scope.registerUser = function () {
    $rootScope.users = [];
    userService.loginUser($scope.user.firstName, $scope.user.lastName).then(
      function (data) {
        console.log("Logged in");
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


  $scope.logout = function () {
    userService.logout();
    $state.go("register");
  }

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
