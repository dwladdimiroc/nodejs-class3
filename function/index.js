//Función Javascript

//Variables de conexión
var serverIP = 'localhost';
var port = 8080;

//Variables locales
var room = 'Principal';	//Sala que está conectado el usuario

//Conexión al socket del servidor
try {
	socket = io.connect(serverIP+':'+port+'/');
	
	//Callback de la función multicast
	socket.on('multicastCallback', function (data) {
		$('#chat').append('<p>' + data.text + '</p>');
	});

	//Callback de la función broadcast
	socket.on('broadcastCallback', function (data) {
		$('#chat').append('<p>' + data.text + '</p>');
	});

	console.log('Conexión del user con el Socket')
}
catch (err) {
	alert('No está disponible el servidor Node.js');
}

$(document).ready(function() {
	//Cuando el documento está disponible, se conectará
	//con el socket en la sala principal
	socket.emit('initRoom', {room: room});
	socket.emit('broadcast', {text: "Un usuario entró a la sala " + room});

	//En caso que se haga click al botón enviar,
	//se enviará a los usuarios que son participes
	//de la misma sala
	$('#btn-send').click(function() {
		var message = $('#text-send').val();
		$('#text-send').val('');
		socket.emit('multicast', {text: message, room: room});
	});

	//Y en el caso que cambie de sala, tomará el id
	//de la sala que se desea cambiar.
    $('ul.dropdown-menu li').click(function (data) {
    	//Salirse de la sala actual
    	socket.emit('exitRoom', {room: room});
    	//Recuperar 'id' de la sala deseada
    	//para luego entrar en esa sala
    	room = this.id;
    	socket.emit('initRoom', {room: room});
    	$('#chat').empty();
    	socket.emit('broadcast', {text: "Un usuario entró a la sala " + room});
    });
});

		
