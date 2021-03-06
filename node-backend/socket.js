const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');

const IMAGE_PATH = 'images/';

// var room = '1234';
var clients = new Map();
var clientsRooms = new Map();

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});
// creates a room document in the database
// request: username, pin
// response: roomID
app.get('/createRoom/:username/:roomName', (req, res) => {
	// get the parameters in request
	var username = req.params.username;
	var roomName = req.params.roomName;
	// var roomCode = Math.floor(Math.random() * Math.floor(10000));
	var room = new Room({
		roomName,
		users: [{username: username}]
	});
	// save to database
	room.save().then((doc) => {
		if (!doc) {
			console.log("Error");
			res.status(400).send({
				msg: 'no'
			});
		}
		else {
			console.log(doc);
			res.send(
				{msg: 'yes'});
		}
	}).catch((e) => {
		console.log('duplicate keys');
		res.status(400).send({
				msg: 'no'
			});
	});
	
});

app.get('/enterRoom/:username/:roomName', (req, res) => {
	var roomName = req.params.roomName;
	var username = req.params.username;
	Room.findOne({roomName: roomName}, (err, room) => {
		if (err) {
			throw err;
			res.send(400);
		}
		room.users.push({username: username});
		room.save();
		res.send('Entered the room');
		console.log(room);
	}).catch((e) => {
		res.status(404).send();
	});
});
app.get('/images/:imageFilename', (req, res) => {
	res.sendFile(path.resolve(path.resolve(__dirname,'images/'+req.params.imageFilename)));
});

// takes the file in the form and store it to the file system
// 		roomID: id of current user's room
// 		filetoupload: the image file that th user is going to upload
app.post('/upload', (req, res) => {
	var form = new formidable.IncomingForm();
  	form.parse(req, (err, fields, files) => {
  	  var roomName = fields.roomName;
  	  // save to local file system
  	  var oldpath = files.photo.path;
  	  var d = new Date();
	  var random_filename = d.getTime()+".jpg";
  	  var newpath = IMAGE_PATH + random_filename;
  	  fs.rename(oldpath, newpath, (err) => {
  	  	if (err) throw err;
  	  });
  	  console.log('New file received');
  	  // update the databse
  	  // Room.findById(roomID, (err, room) => {
  	  // 	if (err) {
  	  // 		return res.status(404).send();
  	  // 	}
  	  // 	room.images.push({filename: files.filetoupload.name});
  	  // 	console.log(room);
  	  // 	room.save();
  	  // }).catch((e) => {
  	  // 	res.status(400).send();
  	  // });
  	  res.send({
  	  	"msg": "ok",
  	  	"imageFilename": random_filename
  	  });
  	  // res.end();
  	});
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
		    var msg = "".concat(clients[socket.id], ' entered the room '+roomNum);
			//console.log("cancat: " + msg);
			io.to(roomNum).emit('message', msg);
		});
	});

	// when someone upload the image for the room, send it to everyone in that room
	socket.on('imageReady', (imageFilename) => {
		var roomNum = clientsRooms[socket.id];
		console.log(imageFilename+" is ready in room "+roomNum);
		io.to(roomNum).emit('imageReady', imageFilename);
	});

	// the change of the image on one client is sent to every one in real time
	socket.on('modifyImage', (json) => {
		var roomNum = clientsRooms[socket.id];
		io.to(roomNum).emit('modifyImage', json);
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
// helper
function removeAllImages(){
	var directory = "images";
	fs.readdir(directory, (err, files) => {
	  if (err) throw err;

	  for (const file of files) {
	    fs.unlink(path.join(directory, file), err => {
	      if (err) throw err;
	      console.log('successfully deleted '+file);
	    });
	  }
	});
}
function removeFile(filePath){
	fs.unlink(filePath, (err) => {
		if (err) throw err;
		console.log('successfully deleted '+filePath);
	});
}

http.listen(3000, () => {
	console.log('listening on *: 3000');
});
