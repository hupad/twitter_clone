var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fixtures = require('./fixtures.js');
var conn = require('./db');
var bcrypt = require('bcrypt');

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){

	User = conn.model('User');
	
	User.findOne({'id': id}, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(function(username, password, done){
	User = conn.model('User');
	console.log("Hiiii");
	User.findOne({'id': username}, function(err, user) {
		if (user) {
			bcrypt.compare(password, user.password, function(err, res) {
			   if (!res) {
					return done(null, false, { message: 'Incorrect password.' });
				}else{
					return done(null, user);
				} 
			});
		}else{
			return done(null, false, { message: 'Incorrect username.' });
		}
	});
}));


module.exports = passport;