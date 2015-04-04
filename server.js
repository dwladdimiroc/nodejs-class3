var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

var port = 8080;

server.listen(port);

console.log('Start Web Services NodeJS in Port ' + port);

//Path de los CSS que utilizarán para el estilo de la página
app.use("/css", express.static(__dirname + '/css'));

//Path de funciones en Javascript que podrían utilizar
app.use("/function", express.static(__dirname + '/function'));
app.use("/js", express.static(__dirname + '/js'));

//Routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/view/index.html');
});

io.sockets.on('connection', function (socket) {
	
	socket.on('initRoom', function (data) {
		console.log("Un usuario entró al chat de la sala " + data.room);
		socket.join(data.room);
	});

	socket.on('exitRoom', function (data) {
		console.log("Un usuario se salió del chat de la sala " + data.room);
		socket.leave(data.room);
	});

	socket.on('disconnect', function () {
		console.log("Usuario desconectado");
	});
	
	socket.on('broadcast', function (data) {
		console.log("Un usuario envió el mensaje: " + data.text);
		socket.broadcast.emit('broadcastCallback', { text:data.text});
	});

	socket.on('multicast', function (data) {
		console.log("Se envió el mensaje " + data.text + " a la sala " + data.room);
		io.sockets.in(data.room).emit('multicastCallback', {text:data.text});
	});
});
