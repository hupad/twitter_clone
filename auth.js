var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fixtures = require('./fixtures.js')

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	
	var foundUser = false;

	for (var i = fixtures.users.length - 1; i >= 0; i--) {
		if ( fixtures.users[i].id == id ) {
			foundUser = true;
			done( null, fixtures.users[i] );
		}
	}

	if (!foundUser) {
		done(null, false);
	}
});

passport.use(new LocalStrategy(function(username, password, done){
	
	var user = null;

	for (var i = fixtures.users.length - 1; i >= 0; i--) {

		if ( fixtures.users[i].id == username ) {
			user = fixtures.users[i];
		}
	}

	if (!user) {
		return done(null, false, { message: 'Incorrect username.' });
	}

	if (user.password !== password) {
		return done(null, false, { message: 'Incorrect password.' });
	}

	return done(null, user);
}));


module.exports = passport;