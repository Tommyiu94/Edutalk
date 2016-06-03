var app = require("http").createServer();
var io = require("socket.io")(app);
//user stores all the sockets
var user = {};
//room stores all the room id
var room = {};

app.listen(8080);

io.on("connection", function(socket){

	socket.on("login", function(userName){

		console.log("User " + userName + " logins");

		try {
			if (user[userName]){

				socket.emit("login", {
					type: "login",
					userName: userName,
					status: "fail"
				});

				console.log("Login unsuccessfully");
			} else{
				user[userName] = socket;
				user[userName].userName = userName;
				socket.emit("login", {
					type: "login",
					userName: userName,
					status: "success"
				});
			}}catch (e){
				console.log(e);
			}
	})

	socket.on("createRoom", function(roomId){
		try {
			if (room[roomId]){
				socket.emit("createRoom", {
					type: "createRoom",
					userName: socket.userName,
					room: roomId,
					status: "fail"
				});
			} else{
				room[roomId] = {};
				room[roomId].roomId = roomId;
				user[socket.userName].room = roomId; 
				user[socket.userName].join(room[roomId]); 

				socket.emit("createRoom", {
					type: "createRoom",
					userName: socket.userName,
					room: roomId,
					status: "success"
				});

			}}catch (e){
				console.log(e);
			}
	})

	socket.on("joinRoom", function(roomId){
		try {
			if (room[roomId]){

				socket.emit("host", {
					type: "host",
					host: room[roomId].host
				});

				user[socket.userName].room = roomId;
				user[socket.userName].join(room[roomId]); 

				socket.emit("joinRoom", {
					type: "joinRoom",
					userName: socket.userName,
					status: "success"
				});
			} else{
				socket.emit("joinRoom", {
					type: "joinRoom",
					userName: socket.userName,
					room: roomId,
					status: "fail"
				});

			}}catch (e){
				console.log(e);
			}
	})

	socket.on("SDPOffer", function(sdpOffer){

		console.log(sdpOffer.local + " is Sending offer to " + sdpOffer.remote);

		try {
			if (user[sdpOffer.remote]){
				user[sdpOffer.remote].emit("SDPOffer", {
					type: "SDPOffer",
					local: sdpOffer.remote,
					remote: sdpOffer.local,
					offer: sdpOffer.offer
				});
			}else{
				socket.emit("feedback", "Sending Offer: User does not exist or currently offline");
			}} catch(e){
				console.log(e);
			}
	})

	socket.on("SDPAnswer", function(sdpAnswer){
		console.log( sdpAnswer.remote + " is Receiving Answer from " + sdpAnswer.local);

		try {
			if (user[sdpAnswer.remote]){
				user[sdpAnswer.remote].emit("SDPAnswer",{
					type: "SDPAnswer",
					local: sdpAnswer.remote,
					remote: sdpAnswer.local,
					answer: sdpAnswer.answer
				});	

			}else{
				socket.emit("feedback", "Sending Answer: User does not exist or currently offline");
			}} catch(e){
				console.log(e);
			}
	})

	socket.on("candidate", function(iceCandidate){
		console.log("an ice candidate is transfered");
		user[iceCandidate.remote].emit("candidate", {
			type: "candidate",
			local: iceCandidate.remote,
			remote: iceCandidate.local,
			candidate: iceCandidate.candidate
		});
	})

	socket.on("disconnect", function(){
		socket.broadcast.to(socket.room).emit("disconnectedUser", socket.userName);
		user[socket.userName] = null;
	})

	socket.on("peerConnection", function(command){
		try {
			user[command[1]].emit("initConnection", command[2]);
			console.log("User " + command[1] + " initialise connection to user " + command[2]);
		} catch(e){
			console.log(e);
		}
	})

	socket.on("broadcast", function(command){
		try {
			console.log(io.sockets.adapter.rooms);
			console.log(io.sockets.adapter.rooms[socket.room]);
			var clients = io.sockets.adapter.rooms[room[socket.room]].sockets; 
			for (var clientId in clients ) {
				var clientSocket = io.sockets.connected[clientId];
				user[command[1]].emit("initConnection", clientSocket.userName);
				console.log(clientSocket.userName);
			}
		} catch(e){
			console.log(e);
		}
	})

})
