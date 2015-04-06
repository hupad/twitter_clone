
var express = require('express');
var fixtures = require('./fixtures.js');
var bodyParser =  require("body-parser");

var app = express();

app.use(bodyParser.json());


app.get('/api/tweets', function(request, response){
	var userId = request.query.userId;
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
		// response.statusCode = 400;
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

	var userExists = false;
	for (var i = fixtures.users.length - 1; i >= 0; i--) {
		if (fixtures.users[i].id === data.user.id) {
			userExists = true;
		}
	}

	if (userExists) {
		return response.sendStatus(409);
	}else{
		fixtures.users.push(data.user);
		return response.send(data);
	}
});

var server = app.listen(3000,'127.0.0.1', function(request, response){
});


module.exports = server;