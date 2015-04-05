
var express = require('express');
var fixtures = require('./fixtures.js');

var app = express();


app.get('/api/tweets', function(request, response){
	var userId = request.query.userId;
	var results = [];
	var responseObj = {};

	if (userId) {
		for (var i = fixtures.tweets.length - 1; i >= 0; i--) {
			if ( fixtures.tweets[i].userId === userId) {
				results.push(fixtures.tweets[i]);
			}
			responseObj['tweets'] = results;
			response.statusCode = 200;
		}
	}else{
		response.statusCode = 400;
		responseObj = {};
	}
	response.writeHead(response.statusCode);
	response.end(responseObj);
});

var server = app.listen(3000,'127.0.0.1', function(request, response){
});


module.exports = server;