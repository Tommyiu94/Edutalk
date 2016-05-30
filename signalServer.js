var app = require("http").createServer();
var io = require("socket.io")(app);
var user = {};
var room = {};

app.listen(8888);

io.on("connection", function(socket){

	socket.on("login", function(data){

		console.log("User " + data + " logins");

		try {
			if (user[data]){

				socket.emit("login", {
					type: "login",
					userName: "data",
					status: "fail"
				});

				console.log(data);
				console.log("Login unsuccessfully");
			} else{
				socket.userName = data;
				user[data] = socket;
				socket.emit("login", {
					type: "login",
					userName: data,
					status: "success"
				});
				console.log("username in server is: ");
				console.log(data);
				console.log("Login successfully");
			}}catch (e){
				console.log(e);
			}
	})

	socket.on("createRoom", function(data){
		try {
			if (room[data]){
				socket.emit("createRoom", {
					type: "createRoom",
					userName: socket.userName,
					room: data,
					status: "fail"
				});
			} else{

				socket.room = data;
				room[data] = data;
				socket.join(room[data]);

				socket.emit("createRoom", {
					type: "createRoom",
					userName: socket.userName,
					room: data,
					status: "success"
				});
				console.log("Successfully create room");

			}}catch (e){
				console.log(e);
			}
	})

	socket.on("joinRoom", function(data){
		try {
			if (room[data]){

				socket.room = data;
				socket.join(room[data]);
				socket.emit("joinRoom", {
					type: "joinRoom",
					userName: socket.userName,
					status: "success"
				});

				io.sockets.in(room[data]).emit("feedback", "User " + data + " is in room + " + data + " now" );	
				socket.broadcast.to(room[data]).emit("newUser", socket.userName);

				console.log("Join room successfully");
			} else{

				socket.emit("joinRoom", {
					type: "joinRoom",
					userName: socket.userName,
					room: data,
					status: "fail"
				});

			}}catch (e){
				console.log(e);
			}
	})

	socket.on("peer", function(){
		try {
			var clients = io.sockets.adapter.rooms[socket.room].sockets;   

			for (var clientId in clients ) {
				console.log("client Id is " + clientId);
				var clientSocket = io.sockets.connected[clientId];
				console.log("client Username is " + clientSocket.userName);
				var userList = {};
				userList[clientSocket.userName] = clientSocket.userName;
			}
			
			socket.emit("peer", {
				type: "peer",
				allUser: userList
			});
		} catch(e){
			socket.emit("feedback", "Asking for peers failed");
			console.log(e);
		}
	})

	socket.on("SDPOffer", function(data){

		console.log(data.local + " is Sending offer to " + data.remote);

		try {
			if (user[data.remote]){
				socket = user[data.remote];
				socket.emit("SDPOffer", {
					type: "SDPOffer",
					local: data.remote,
					remote: data.local,
					offer: data.offer
				});
				console.log("remote is " + data.remote + "local is "+ data.local);
			}else{
				socket.emit("feedback", "Sending Offer: User does not exist or currently offline");
			}} catch(e){
				console.log(e);
			}
	})

	socket.on("SDPAnswer", function(data){
		console.log(  data.remote + " is Receiving Answer from " + data.local);

		try {
			if (user[data.remote]){
				socket = user[data.remote];
				socket.emit("SDPAnswer",{
					type: "SDPAnswer",
					local: data.remote,
					remote: data.local,
					answer: data.answer
				});	
			}else{
				socket.emit("feedback", "Sending Answer: User does not exist or currently offline");
			}} catch(e){
				console.log(e);
			}
	})

	socket.on("candidate", function(data){
		console.log("candidate local is ");
		console.log(data.local);
		console.log("candidate remote is ");
		console.log(data.remote);
		socket = user[data.remote];
		socket.emit("candidate", {
			type: "candidate",
			local: data.remote,
			remote: data.local,
			candidate: data.candidate
		});
	})

	socket.on("leave", function(data){

		console.log(data[1] + " left");

		try {
			if (user[data[1]]){
				socket =  user[data[2]];
				socket.emit("feedback", "User " + data[1] + " is disconnected");
				socket = user[data[1]];
				socket.emit("feedback", "Disconnected successfully");	
				user[data[1]] = null;
				console.log("disconnected successfully");
			}else{
				socket.emit("feedback", "User does not exist or currently offline");
			}} catch(e){
				console.log(e);
			}
	})

	socket.on("ICESetupStatus", function(data){
		console.log("ok!");
		console.log(data.local + " is Sending Status to " + data.remote);

		try {
			if (user[data.remote]){
				socket = user[data.remote];
				socket.emit("ICESetupStatus", {
					type: "ICESetupStatus",
					local: data.remote,
					remote: data.local,
					offer: data.offer
				});
				console.log("remote is " + data.remote + "local is "+ data.local);
			}else{
				socket.emit("feedback", "Sending Status: User does not exist or currently offline");
			}} catch(e){
				console.log(e);
			}
	})
})
