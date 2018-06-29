var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({username: String});

var imageSchema = new Schema({filename: String});

var roomSchema = new Schema({
	roomName: {
		type: String,
		unique: true
	},
	users: [userSchema],
	images: [imageSchema]
});

var Room = mongoose.model('Room', roomSchema);

module.exports = {Room};