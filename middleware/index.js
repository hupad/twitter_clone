var bodyParser =  require("body-parser");
var passport = require('../auth.js');
var session  = require('express-session');

module.exports = function(app) {
	app.use(bodyParser.json());

	app.use(session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: true
	}));

	app.use(passport.initialize());
	app.use(passport.session());

}