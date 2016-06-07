var MESSAGE_CPU_FREE = "FREE";
var MESSAGE_CPU_BUSY = "BUSY";
var app = require("http").createServer();
var io = require("socket.io")(app);
app.listen(8888);
var tasks = [];
var cpuSocket;
var adminSocket;

var cpuStatus = MESSAGE_CPU_FREE;

console.log("taskProcessor start to work");

io.on("connection", function(taskSocket){

	taskSocket.on("cpu", function(){
		cpuSocket = taskSocket;
	});

	taskSocket.on("admin", function(){
		adminSocket = taskSocket;
	});

	taskSocket.on("newUser", function(userData){
		tasks.push({
			type: "newUser",
			userName: userData.userName
		});
//		TO DO: setTime out for cpu processing
		if (cpuStatus === MESSAGE_CPU_FREE){
			cpuStatus = MESSAGE_CPU_BUSY;
			userProcessing = tasks.shift();

			cpuSocket.emit("newUser", {
				type: "newUser",
				userName: userProcessing.userName,
				host: userProcessing.host
			});
		}
	});

	taskSocket.on("disconnectedUser", function(userData){
		tasks.push({
			type: "disconnectedUser",
			userName: userData.userName
		});

		if (cpuStatus === MESSAGE_CPU_FREE){
			cpuStatus = MESSAGE_CPU_BUSY;
			userProcessing = tasks.shift();

			cpuSocket.emit("disconnectedUser", {
				type: "disconnectedUser",
				userName: userProcessing.userName,
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
			cpuSocket.emit(userProcessing.type, {
				type: userProcessing.type,
				userName: userProcessing.userName,
			});
		} else {
			cpuStatus = MESSAGE_CPU_FREE;		
		}
	});

	taskSocket.on("host", function(userData){
		cpuStatus = MESSAGE_CPU_FREE;	
//		TO DO: to be filled
	})

});