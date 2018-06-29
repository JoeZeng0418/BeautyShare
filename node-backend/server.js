const express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var {mongoose} = require('./models/mongoose');
const bodyParser = require('body-parser');

var {Room} = require('./models/room');

const IMAGE_PATH = '/Users/xumuyao/Desktop/BeautyShare/files/';

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


// file upload page
app.get('/', (req, res) => {
	app.set('view engine', 'ejs');
	res.sendFile(__dirname + '/public/fileupload.html');
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

app.post('/createRoom/', (req, res) => {
	// get the parameters in request
	var username = req.body.username;
	// var roomCode = Math.floor(Math.random() * Math.floor(10000));
	var room = new Room({
		// roomName,
		users: [{username: username}]
	});
	// save to database
	room.save().then((doc) => {
		if (!doc) console.log("Error");
		else {
			console.log(doc);
			res.send(doc.id);
		}
	});
	
});

// has the same functionality as createRoom, but takes form data instead
app.post('/createRoomByForm', (req, res) => {
	var form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		console.log(fields);
		var pin = fields.pin;
		var username = fields.username;
		var room = new Room({
		pincode: pin,
		users: [{username: username}]
		});
		// save to database
		room.save().then((doc) => {
			if (!doc) console.log("Error");
			else console.log(doc);
			res.write(doc.id);
		res.end();
		});
	});
});

// 
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

// takes the file in the form and store it to the file system
// 		roomID: id of current user's room
// 		filetoupload: the image file that th user is going to upload
app.post('/upload', (req, res) => {
	var form = new formidable.IncomingForm();
  	form.parse(req, (err, fields, files) => {
  	  var roomID = fields.roomID;
  	  // save to local file system
  	  var oldpath = files.filetoupload.path;
  	  var newpath = IMAGE_PATH + files.filetoupload.name;
  	  fs.rename(oldpath, newpath, (err) => {
  	  	if (err) throw err;
  	  });
  	  // update the databse
  	  Room.findById(roomID, (err, room) => {
  	  	if (err) {
  	  		return res.status(404).send();
  	  	}
  	  	room.images.push({filename: files.filetoupload.name});
  	  	console.log(room);
  	  	room.save();
  	  }).catch((e) => {
  	  	res.status(400).send();
  	  });
  	  res.write('File uploaded');
  	  res.end();
  	});
});

// takes the filename and returns the image
app.get('/download/:filename', (req, res) => {
	var filename = req.params.filename;
	res.download(__dirname + '/files/' + filename);
});

// takes the roomid and returns the filenames
app.get('/getFilenames/', (req, res) => {
	console.log('iam here');
	var roomID = req.query.room;
	Room.findById(roomID, (err, room) => {
		if (err) {
			console.log('cannot get');
			return res.status(404).send();
		}
		res.write(JSON.stringify(room.images));
		res.end();
	}).catch((e) => {
		res.status(400).send();
	});
});

app.listen(3000, ()=> {
	console.log('Start on port 3000');
});

module.exports = {app};