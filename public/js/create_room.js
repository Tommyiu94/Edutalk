$(function(){
  var roomid="";
  /* $(".action").click(function () {
       var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
       for( var i=0; i < 10; i++ )
         roomid += possible.charAt(Math.floor(Math.random() * possible.length));
       window.location.href = window.location  +roomid;
     }); */
  $("#roomNumber").keyup(function (event) {
    if (event.keyCode == 13) {
      roomid = $(".roomNo").val();
      // createRoom(roomid);
      window.location.href = window.location + "/" + roomid;
    }
  })
  $(".createRoom").click(function() {
    roomid = $(".roomNo").val();
    // roomid = roomid.slice(-10);
    /* if(/[^a-zA-Z0-9]/.test( roomid )){
         roomid = "";
    // alert("Please enter a valid link or 10 character long roomid.\n Eg.Fcer9vtsre");
    }
    else */
    window.location.href = window.location + "/" + roomid;
    });
});