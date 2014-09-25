angular.module('chatApp.services', [])

.service('userService', function () {
    return  {
      onlineUsers : function (){
        return [{"firstname" : "Test", "lastname": "Toast"}];
      }
    }
});