angular.module('chatApp.services', ['chatApp.networking'])

.service('userService', ['WebSocketService', '$rootScope', function (socket, $rootScope) {
    return  {
      onlineUsers : function () {
        return socket.send("online", {});
      },
      loginUser : function (firstName, lastName) {
        var userId = u4id();
        $rootScope.currentUser = { "userid" : userId, "firstname" : firstName, "lastname" : lastName };
        return socket.send("login", { "userId" : u4id(), "firstName" : firstName, "lastName" : lastName });
      }
    }
}]);

function u4id() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
}