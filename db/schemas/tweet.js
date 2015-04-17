var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tweet = new Schema({
	text: String,
	created: Number,
	userId: String
});

module.exports = Tweet;