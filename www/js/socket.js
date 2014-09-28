
/*
  Generates 4 digit short Id
 */
function u4id() {
  return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4)
}


angular.module('chatApp.networking', [])

.factory('WebSocketService', ['$q', function ($q) {

  return {

    /*
      Request structure:

        {
          "id" : "i26t",
          "event" : "login",
          "userId" : "d26w",
          "firstName" : "Tharun",
          "lastName" : "Paul"
        }
     */
   

    // The websocket object
    ws: null,
    /*Callbacks  stores the list of callback defer objects along with the
    request id.
     {
       requestId : cb (defer).
     }
    
    When response is received in the `onmessage` callback corresponding to this requestId,
    it looks up this callback function with the id.
    */
    callbacks: {},

    /*
      Event listeners
     */
    listeners: {},

    /**
     * Initialize the websocket connection
     */
    init: function () {
      
      var self = this;
      this.ws = new WebSocket("ws://192.168.4.248:8080/websocket");

      this.ws.onmessage = function (event) {
        console.log("Server:", event.data);
        self.receive(event.data);
      };

      this.ws.onclose = function () {
        console.log("Socket closed");
      };

      this.ws.onopen = function () {
        console.log("Connected to Websocket server");
      };

    },
    on: function (eventName, eventFunction) {
      this.listeners[eventName] = eventFunction;
    },
    // Websocket send
    send: function (action, data) {
      var requestObj = {};
      requestObj["id"] = u4id();
      requestObj["event"] = action;
      // Use key value pairs to send data.
      Object.keys(data).forEach(function (key) {
        requestObj[key] = data[key];
      });

      // Send data to server.
      this.ws.send(JSON.stringify(requestObj));
      // Register with callbacks.
      var cb = $q.defer();
      this.callbacks[requestObj["id"]] = cb;
      return cb.promise;
    },
    // Websocket receive
    receive: function (data) {
      var responseObj;
      var self = this;
      try {
        responseObj = JSON.parse(data);
      } catch (e) {
        console.log("Invalid json", e);
      }
      if (responseObj["event"] !== undefined) {
        var cb = self.listeners[responseObj["event"]]
        cb(responseObj);
      } else {
        var id = responseObj["id"];
        var status = responseObj["status"];
        var cb = this.callbacks[id];
        if (status === "success") {
          cb.resolve(responseObj);
        } else {
          cb.reject(responseObj);
        }
      }
    }
  };

}])


.run(function (WebSocketService) {
  WebSocketService.init();
});
