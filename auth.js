var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fixtures = require('./fixtures.js');
var conn = require('./db');

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){

	var user = new conn.model('User');
	console.log(user);
	user.findOne({'id': id}, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(function(username, password, done){

	User = conn.model('User');
	var user = new User();
	user.findOne({'id': username}, function(err, user) {
		if (user) {
			if (user.password !== password) {
				return done(null, false, { message: 'Incorrect password.' });
			}else{
				return done(null, user);
			}
		}else{
			return done(null, false, { message: 'Incorrect username.' });
		}
	});
}));


module.exports = passport;