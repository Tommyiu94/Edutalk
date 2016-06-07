var MESSAGE_CPU_FREE = "FREE";
var MESSAGE_CPU_BUSY = "BUSY";
var app = require("http").createServer();
var io = require("socket.io")(app);
app.listen(8888);
var tasks = [];
var cpuSocket;
var adminSocket;

var cpuStatus = MESSAGE_CPU_FREE;

io.on("connection", function(taskSocket){

	taskSocket.on("cpu", function(){
		cpuSocket = taskSocket;
	});

	taskSocket.on("admin", function(){
		adminSocket = taskSocket;
	});

	taskSocket.on("peerConnection", function(userData){

		tasks.push(userData);
//		TO DO: setTime out for cpu processing
		if (cpuStatus === MESSAGE_CPU_FREE){
			cpuStatus = MESSAGE_CPU_BUSY;
			console.log(tasks.length);
			userProcessing = tasks.shift();
			console.log(tasks.length);

			cpuSocket.emit("peerConnection", {
				type: "peerConnection",
				userName: userProcessing.userName,
				host: userProcessing.host
			});
		}
	});

	taskSocket.on("newPeerConnection", function(userData){
		console.log(userData.userName);
		console.log(userData.host);

//		TO DO: setTime out for cpu processing
		adminSocket.emit("newPeerConnection", {
			type: "newPeerConnection",
			userName: userData.userName,
			host: userData.host
		});

		if (tasks.length !== 0){
			userProcessing = tasks.shift;
			cpuSocket.emit("peerConnection", {
				type: "peerConnection",
				userName: userData.userName,
				host: userData.host
			});
		} else {
			cpuStatus = MESSAGE_CPU_FREE;		
		}
	});

});