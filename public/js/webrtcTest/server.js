var app = require("http").createServer();
var io = require("socket.io")(app);
var user = {};
var room = {};

app.listen(8080);

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
				user[data] = socket;
				user[data].userName = data;
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
				room[data] = data;
				user[socket.userName].room =data; 
				user[socket.userName].join(room[data]); 
				
				socket.emit("createRoom", {
					type: "createRoom",
					userName: socket.userName,
					room: data,
					status: "success"
				});

			}}catch (e){
				console.log(e);
			}
	})

	socket.on("joinRoom", function(data){
		try {
			if (room[data]){
				user[socket.userName].room = data;
				user[socket.userName].join(room[data]);

				socket.emit("joinRoom", {
					type: "joinRoom",
					userName: socket.userName,
					status: "success"
				});

				io.sockets.in(room[data]).emit("feedback", "User " + data + " is in room + " + data + " now" );	
				socket.broadcast.to(room[data]).emit("newUser", socket.userName);

				console.log("Login successfully");
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

	socket.on("peer", function(data){
		try {
			console.log(data);
			console.log(user[data]);
			socket = user[data];
			var clients = io.sockets.adapter.rooms[socket.room].sockets;   
			var userList = {};
			for (var clientId in clients ) {
				var clientSocket = io.sockets.connected[clientId];
				userList[clientSocket.userName] = clientSocket.userName;
			}

			socket.emit("peer", {
				type: "peer",
				allUser: userList
			});
		} catch(e){
			console.log(e);
		}
	})

	socket.on("SDPOffer", function(data){

		console.log(data.local + " is Sending offer to " + data.remote);

		try {
			if (user[data.remote]){
				user[data.remote].emit("SDPOffer", {
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
				user[data.remote].emit("SDPAnswer",{
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
		user[data.remote].emit("candidate", {
			type: "candidate",
			local: data.remote,
			remote: data.local,
			candidate: data.candidate
		});
	})

	socket.on("disconnect", function(){
		console.log("socketId is " + socket.id);
		console.log("user is " + socket.userName);
	})

	socket.on("ICESetupStatus", function(data){
		try {
			if (user[data.remote]){
				user[data.remote].emit("ICESetupStatus", {
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
