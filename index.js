
var express = require('express');
var fixtures = require('./fixtures.js');
var bodyParser =  require("body-parser");
var moment = require('moment');
var session  = require('express-session');
var passport = require('./auth.js');
var config = require('./config');
var conn = require('./db')

var app = express();

app.use(bodyParser.json());

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/api/tweets', function(request, response){
	var userId = request.query.userId;;
	var results = [];
	var responseObj = {};

	if (userId) {
		for (var i = fixtures.tweets.length - 1; i >= 0; i--) {
			if ( fixtures.tweets[i].userId === userId) {
				results.push(fixtures.tweets[i]);
			}
		}
		responseObj['tweets'] = results;
		return response.send(responseObj);
	}else{
		return response.sendStatus(400)
	}
});

app.get('/api/users/:userId', function(request, response){
	
	var userId = request.params.userId;
	var data = {};
	var userFound = false;
	for (var i = fixtures.users.length - 1; i >= 0; i--) {
		if (fixtures.users[i].id === userId) {
			userFound = true;
			data["user"] = fixtures.users[i];
		}
	}
	if (userFound) {
		return response.send(data);
	}else{
		return response.sendStatus(404);
	}
});

app.post('/api/users', function(request, response){

	var followingIds = [];
	var data = {user:{}};

	data.user.id = request.body.user.id;
	data.user.name = request.body.user.name;
	data.user.email = request.body.user.email;
	data.user.password = request.body.user.password;
	data.user.followingIds = followingIds;

	User = conn.model('User');
	var user = new User(
		{
			'id': data.user.id, 
			'email': data.user.email, 
			'name': data.user.name, 
			'password': data.user.password, 
			'followingIds': data.user.followingIds }
		);
	user.save(function(err) {
		if (err) { return response.sendStatus(409) }
		return response.sendStatus(200);
	});
});

app.post('/api/tweets', ensureAuthentication, function(request, response){
	var data = { tweet: {} };
	var max = 0;

	data.tweet.userId = request.user.id;
	data.tweet.text = request.body.tweet.text;

	for (var i = fixtures.tweets.length - 1; i >= 0; i--) {
		if (fixtures.tweets[i].id > max) {
			max = fixtures.tweets[i].id;
		}
	}
	
	data.tweet.id = max + 1;
	data.tweet.created = moment().unix();

	fixtures.tweets.push(data.tweet);

	return response.send(data);

});

app.get('/api/tweets/:tweetId', function(request, response){
	
	var tweetId = request.params.tweetId;
	var data = {};

	if (tweetId) {
		
		for (var i = fixtures.tweets.length - 1; i >= 0; i--) {
			
			if ( tweetId === fixtures.tweets[i].id ) {
				data['tweet'] = fixtures.tweets[i];
			}
		}
	}
	if (Object.keys(data).length > 0) {
		return response.send(data);
	}else{
		return response.sendStatus(404);
	}
});

app.delete('/api/tweets/:tweetId', ensureAuthentication, function(request, response){
	var tweetId = request.params.tweetId;
	var index = -1;

	for (var i = fixtures.tweets.length - 1; i >= 0; i--) {
		if ( tweetId === fixtures.tweets[i].id ) {
			index = i;
		}
	}

	if (index != -1) {
		if ( request.user.id === fixtures.tweets[index].userId ) {
			fixtures.tweets.splice(index, 1);
			return response.sendStatus(200);
		}else{
			return response.sendStatus(403);
		}
	}else{
		return response.sendStatus(404);
	}
});

app.post('/api/auth/login', function(request, response, next){
	
	passport.authenticate('local', function(err, user, info) {
		var data = {}
	    if (err) { return next(err); }
	    if (!user) { return response.sendStatus(403); }
	    request.logIn(user, function(err) {
	      if (err) { return next(err); }
	      	data['user'] = user;
	      	return response.send(data);
	    });
	})(request, response, next);
});

app.post('/api/auth/logout', function(request, response, next){
	request.logout();
	response.sendStatus(200);
});

function ensureAuthentication(request, response, next) {
	if (!request.isAuthenticated()) {
		response.sendStatus(403);
	}else{
		next();
	}
}

var server = app.listen(config.get('server:port'), config.get('server:host'), function(request, response){
});


module.exports = server;