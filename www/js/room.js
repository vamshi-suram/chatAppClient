angular.module('chatApp.services')

.service('roomService', ['WebSocketService', '$rootScope',
  function (socket, $rootScope) {
    return {
      createRoom: function () {
        return socket.send("create-room", {
          "roomId" : u4id()
        });
      },
      joinRoom : function (roomId) {
        return socket.send("join-room", {
          "roomId" : roomId
        });
      },
      logout: function () {
        return socket.send("logout", {});
      },
      getOnlineRooms : function () {
        socket.send("online-rooms", {});
      },
      sendMessage: function (roomId, fromUser, message) {
        // Private Message 
        return socket.send("room-broadcast", {
          "roomId": roomId,
          "from": fromUser.firstName,
          "senderId" : fromUser.userId,
          "message": message
        });
      }
    }
  }
]);

function u4id() {
  return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4)
}