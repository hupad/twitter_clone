var mongoose = require('mongoose');
var nconf = require('nconf');
var config = require('../config');
var tweetSchema = require('./schemas/tweet.js');
var userScehma = require('./schemas/user.js');

nconf.env();

var connection;

//db = mongoose.createConnection();

if ( nconf.get('NODE_ENV') === 'dev' ) {
	//db.open('localhost', 'twitterdev', 27017);
	connection = mongoose.createConnection('localhost','twitterdev',27017);
}

if ( nconf.get('NODE_ENV') === 'test' ) {
	//db.open('localhost', 'twittertest', 27017);
	connection = mongoose.createConnection('localhost','twittertest',27017);
}

if ( nconf.get('NODE_ENV') === 'prod' ) {
	//db.open('localhost', 'twitterprod', 27017);
	connection = mongoose.createConnection('localhost','twitterprod',27017);
}

connection.model('User', userScehma);
connection.model('Tweet', tweetSchema);

module.exports = connection;