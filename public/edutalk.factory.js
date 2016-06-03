// edutalk.factory.js
angular
  .module('edutalk')
  .factory('WebRTCService', WebRTCService)
  .factory('DataService', DataService);

function WebRTCService() {
  var webrtc = {};
  return {
    getWebRTC: function(){ return webrtc },
    initWebRTC: function(signal){
      webrtc = new WebRTC(signal);
      return webrtc;
    }
  }
}

function DataService () {
  var username = '';
  return {
    getUsername: function(){
      return username;
    },
    setUsername: function(newUsername) {
      username = newUsername;
    }
  }
}
