angular.module('chatApp.services', ['chatApp.networking'])

.service('userService', ['WebSocketService', '$rootScope', function (socket, $rootScope) {
    return  {
      onlineUsers : function () {
        return socket.send("online", {});
      },
      loginUser : function (firstName, lastName) {
        var userId = u4id();
        $rootScope.currentUser = { "userId" : userId, "firstName" : firstName, "lastName" : lastName };
        return socket.send("login", { "userId" : userId, "firstName" : firstName, "lastName" : lastName });
      },
      logout : function () {
        return socket.send("logout", {});
      },
      sendMessage : function (fromUser, toUser, message) {
        // Private Message
        return socket.send("pm", { "from" : fromUser.userId, "to" : toUser.userId, "message" : message});
      }
    }
}]);

function u4id() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
}