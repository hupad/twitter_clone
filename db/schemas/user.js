var mongoose = require('mongoose');
var bcrypt  = require('bcrypt');

var Schema = mongoose.Schema;

var User = new Schema({
	id: {type: String, unique: true},
	name: String,
	email: {type: String, unique: true},
	password: String,
	followingIds: {type: [String],default: [] }
});

User.pre('save', function(next){
	var that = this;
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(that.password, salt, function(err, hash) {
			that.password = hash;
			next();
		})
	});
});

User.methods.toClient = function() {
	var user = {};
	
	user.id = this.id;
	user.name = this.name;

	return user;
}

module.exports = User;