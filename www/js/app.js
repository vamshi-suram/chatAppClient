// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('chatApp', ['ionic', 'chatApp.router', 'chatApp.services', 'chatApp.networking', 'ngCordova'])

.value('colors', ['#9E0707' , '#A33A07', '#967302', '#779602', '#0D885D', '#2827AA', '#BA134E'])
.controller('mainController', ['$rootScope', '$scope', '$state', 'userService', 'WebSocketService', 'colors', '$cordovaToast', 'roomService', function($rootScope, $scope, $state, userService, websocketService, colors, cordovaToast, roomService) {

  
  websocketService.on("login-broadcast", function (data) {
    var user = {};
    user.userId = data.userId;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    var messageString = "User: " + user.firstName + " " + user.lastName + " has logged in";
    $rootScope.$apply(function () {
      if (user.userId !== $rootScope.currentUser.userId) {
        $rootScope.messageList[user.userId] = []; // Initialize message list.
        $rootScope.users.push(user);
      }
    });
    cordovaToast.show(messageString, 'long', 'center').then(function (success) {
      console.log("The toast was shown");
    }, function (error) {
      console.log("The toast was not shown due to " + error);
    });
  });

  if ($scope.user === undefined) {
    $scope.user = {
      "userId" : "",
      "firstName" : "",
      "lastName" : ""
    };
  }

  if ($rootScope.stateArray === undefined) {
    $rootScope.stateArray = [];
  }

  if ($scope.message === undefined) {
    $scope.message = "";
  }

  if ($rootScope.messageList === undefined) {
    $rootScope.messageList = {};
  }

  if ($rootScope.roomMessageList === undefined) {
    $rootScope.roomMessageList = {};
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
    // If current user is in state `chat` and chatWith points to logged out user,
    // then redirect the user to `users` state.
    if (($state.current.name === "chat") && ($rootScope.chatWith.userId === user.id)) {

      window.setTimeout(function () { $rootScope.chatWith = undefined; $state.go("users"); }, 1000);
      var messageString = "User: " + user.firstName + " " + user.lastName + " has logged out";
      cordovaToast.show(messageString, 'long', 'center').then(function (success) {
        console.log("The toast was shown");
      }, function (error) {
        console.log("The toast was not shown due to " + error);
      });
    } 
    });
  });

  websocketService.on("private-message", function (data) {
    // Find the user who sent the message.
    var fromId = data.from;
    ($rootScope.users).forEach(function (rootScopeUser, i) {
      if (data.from === rootScopeUser.userId) {
        $rootScope.chatWith = rootScopeUser;
        $scope.chatWith = $rootScope.chatWith;
        if ($scope.chatWith !== undefined) {
          if ($rootScope.colorList[$scope.chatWith.userId] === undefined) {
            var randomIndex = Math.floor((Math.random() * colors.length));
            $rootScope.colorList[$scope.chatWith.userId] = colors[randomIndex];
          }
          $scope.otherColor = $rootScope.colorList[$scope.chatWith.userId];
        }

        var mList = $rootScope.messageList[data.from];
        if (mList.length > 0) {
          // Check if the last message is from  same user. If that is the case, instead of adding
          // a new message object, add the message to previous message with a \n.
          var len = mList.length - 1;
          var lastMessage = mList[len];

          if (lastMessage.class === "other") {
            mList[len].msg = mList[len].msg + " " + data.message;
            mList[len].time = new Date();
            $rootScope.messageList[data.from] = mList;
          } else {
            var messageObject = { "time" : new Date(), "class" : "other", "msg" : data.message , "firstLetter" : (rootScopeUser.firstName).slice(0,2), "color": $scope.otherColor || '#9A9EA2'};
            $rootScope.messageList[data.from].push(messageObject); // Add message.           
          }
        } else {
            var messageObject = { "time" : new Date(), "class" : "other", "msg" : data.message, "firstLetter" : (rootScopeUser.firstName).slice(0,2), "color": $scope.otherColor || '#9A9EA2' };
            $rootScope.messageList[data.from].push(messageObject); // Add message.          
        }
        $state.go("chat", {}, {reload : true});
      }
    });
  });

  if ($rootScope.rooms === undefined) {
    $rootScope.rooms = [];
  }

  websocketService.on("room-created", function (data) {
    var roomId = data.roomId;
    $rootScope.roomMessageList[roomId] = [];
    $rootScope.$apply(function () {
      $rootScope.rooms.push({"roomId": roomId, "name" : "Room#" + roomId});
    });
    var tempStr = "New room Room#" + roomId + " created"; 
    cordovaToast.show(tempStr, "long", "bottom");
  });
  
  websocketService.on("room-message", function (data) {
  // Add the message to rootScope.
    ($rootScope.rooms).forEach(function (room) {
      if (room.roomId === data.roomId) {
        $rootScope.$apply(function () {
          $rootScope.currentRoom = room;
          if ($rootScope.colorList[data.senderId] === undefined) {
            var randomIndex = Math.floor((Math.random() * colors.length));
            $rootScope.colorList[data.senderId] = colors[randomIndex];
          }
          var messageObject = { "time" : new Date(), "class" : "other", "msg" : data.message, "firstLetter" : (data.from), "color": $rootScope.colorList[data.senderId] || '#9A9EA2' };
          if ($rootScope.roomMessageList[room.roomId] === undefined) {
            $rootScope.roomMessageList[room.roomId] = [];
          }
          $rootScope.roomMessageList[room.roomId].push(messageObject);
          $scope.currentRoom = room;
          $scope.currentRoomMessageList = $rootScope.roomMessageList[room.roomId];
        });
      }
    });
  });

  websocketService.on("online-rooms", function (data) {
    $rootScope.$apply(function () {
      $rootScope.rooms = [];
      (data.rooms).forEach(function (room) {
        $rootScope.rooms.push({"roomId": room.roomId, "name": "Room#" + room.roomId });
      });
    });
    $state.go("rooms");
  });

  $scope.rooms = $rootScope.rooms;
  $scope.currentRoom = $rootScope.currentRoom;

  if ($rootScope.colorList === undefined) {
    $rootScope.colorList = {};
  }
  $scope.chatWith = $rootScope.chatWith;

  $scope.currentUser = $rootScope.currentUser;

  $scope.currentRoom = $rootScope.currentRoom;

  if ($scope.currentUser !== undefined) {
    if ($rootScope.colorList[$scope.currentUser.userId] === undefined) {
      var randomIndex = Math.floor((Math.random() * colors.length));
      $rootScope.colorList[$scope.currentUser.userId] = colors[randomIndex];
    }
    $scope.selfColor = $rootScope.colorList[$scope.currentUser.userId];
  }


  if ($scope.chatWith !== undefined) {
    $scope.currentMessageList = $rootScope.messageList[$scope.chatWith["userId"]];
  }

  if ($scope.currentRoom !== undefined) {
    $scope.currentRoomMessageList = $rootScope.roomMessageList[$scope.currentRoom["roomId"]];
  }

  if ($scope.roomMessage === undefined) {
    $scope.roomMessage = "";
  }

  $scope.isHome = function () {
    if ($state.current.name === "register") {
      return true;
    } else {
      return false;
    }
  };

  $scope.joinExisting = function () {
    roomService.getOnlineRooms();
  };

  $scope.goToRoom = function (room) {
    $rootScope.currentRoom = room;
    roomService.joinRoom(room.roomId).then(function (response) {
      $state.go("room");
    }, function (error) {
      cordovaToast.show("Error joining room", 'long', 'bottom');
    });
  };

  $scope.sendMessage = function (message) {
    var messageObject = { "time" : new Date(), "class" : "self", "msg" : message, "firstLetter" : ($rootScope.currentUser.firstName).slice(0,2), "color": $scope.selfColor || '#9A9EA2'};
    $rootScope.messageList[$scope.chatWith.userId].push(messageObject);
    $scope.message = "";
    userService.sendMessage($scope.currentUser, $scope.chatWith, message);
  };

  $scope.sendRoomMessage = function (message) {
    $scope.roomMessage = "";
    roomService.sendMessage($scope.currentRoom.roomId, $scope.currentUser, message);
  };

  $scope.createRoom = function () {
    roomService.createRoom().then(function (response) {
      
    }, function (error) {
      cordovaToast.show("Error creating room", 'long', 'center').then(function (success) {
        console.log("The toast was shown");
      }, function (error) {
        console.log("The toast was not shown due to " + error);
      });
    });
  }
  $scope.goBack = function () {
    if ($state.current.name !== "choose") {
      var previousState = $rootScope.stateArray.pop();
      $state.go(previousState);
    }
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
    $state.go("choose");
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
    var lastEl = $rootScope.stateArray[$rootScope.stateArray.length - 1];
    if ((from.name !== lastEl) && (from.name !== "chat") && (from.name !== "room")) {
      $rootScope.stateArray.push(from.name);
    }
    console.log($rootScope.stateArray);
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
