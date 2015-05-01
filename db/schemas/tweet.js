var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tweet = new Schema({
	text: String,
	created: Number,
	userId: String
});

Tweet.methods.toClient = function() {
	var tweet = {};
	
	tweet.id = this._id;
	tweet.text = this.text;
	tweet.created = this.created;
	tweet.userId = this.userId;

	return tweet;
}

module.exports = Tweet;