const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// var room = '1234';
var clients = new Map();
var clientsRooms = new Map();

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
	console.log("having a new connection");
	socket.on('createNickname', (name) => {
		//console.log("in createNickname");
		clients[socket.id] = name;
	});

	socket.on('enterRoom', (roomNum) => {
		console.log(clients[socket.id]+" enter the room "+roomNum);
		socket.join(roomNum, () => {
		    //console.log("room num: " + roomNum);
		    clientsRooms[socket.id] = roomNum;
		    var msg = "".concat(clients[socket.id], ' entered the room!')
			//console.log("cancat: " + msg);
			io.to(roomNum).emit('message', msg);
		});
	});

	socket.on('other event', (msg) => {
		//msg is the modification client has done
		io.to(clientsRooms[socket.id]).emit('message', msg + '...');
	});

	socket.on('disconnect', () => {
		io.to(clientsRooms[socket.id]).emit('message', clients[socket.id] + ' left the room.');
		clients.delete(socket.id);
		clientsRooms.delete(socket.id);
	});
	socket.on('image', ()=>{
		socket.emit('image', { image: true, buffer: buf.toString('base64') });
	});
});

http.listen(3000, () => {
	console.log('listening on *: 3000');
});