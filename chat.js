require('dotenv').config();

function returnUrl() {
	if (process.env.NODE_ENV == 'development') {
		return "http://127.0.0.1:3000"
	} else if (process.env.NODE_ENV == 'production') {
		return "https://debuger-egjfhuhfif.now.sh"
	}
}

const io = require('socket.io-client');
const stdin = process.openStdin();
const notifier = require('node-notifier');

const userdata = { 
	username: "gwuah"
}

console.log("connecting ...\n");
const debugerClient = io.connect(returnUrl());


debugerClient.on("connect", function() {
	console.log("connected to server");
	state = true;
	debugerClient.emit("debuger:register", userdata)

})

debugerClient.on("debuger:registered", function(message) {
	console.log(message);
})

debugerClient.on("debuger:newMessage", function(message) {
	console.log(message);
	notifier.notify({
	  'title': 'Debugger New Notif',
	  'message': message
	});
})

debugerClient.on('disconnect', function (data) {
	console.log("You have been disconnected from server");
})


stdin.addListener("data", function(d) {
  message = d.toString().trim();
  debugerClient.emit("debuger:message", message)
});


