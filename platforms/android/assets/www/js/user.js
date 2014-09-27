angular.module('chatApp.services', ['chatApp.networking'])

.service('userService', ['WebSocketService', '$rootScope',
  function (socket, $rootScope) {
    return {
      onlineUsers: function () {
        var promise = socket.send("online", {});
        promise.then(
          function (data) {
            $rootScope.users = [];
            (data.users).forEach(function (user) {
              if (user.userId !== $rootScope.currentUser.userId) {
                if ($rootScope.messageList[user.userId] === undefined) {
                  $rootScope.messageList[user.userId] = [];
                }
                $rootScope.users.push(user);
              }
            });
          },
          function (error) {
            console.log(error);
          });
      },
      loginUser: function (firstName, lastName) {
        this.onlineUsers();
        var userId = u4id();
        $rootScope.currentUser = {
          "userId": userId,
          "firstName": firstName,
          "lastName": lastName
        };
        return socket.send("login", {
          "userId": userId,
          "firstName": firstName,
          "lastName": lastName
        });
      },
      logout: function () {
        return socket.send("logout", {});
      },
      sendMessage: function (fromUser, toUser, message) {
        // Private Message
        return socket.send("pm", {
          "from": fromUser.userId,
          "to": toUser.userId,
          "message": message
        });
      }
    }
  }
]);

function u4id() {
  return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4)
}