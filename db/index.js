var mongoose = require('mongoose');
var nconf = require('nconf');
var config = require('../config');
var tweetSchema = require('./schemas/tweet.js');
var userScehma = require('./schemas/user.js');

nconf.env();

db = mongoose.createConnection();

if ( nconf.get('NODE_ENV') === 'dev' ) {
	db.open('localhost', 'twitterdev', 27017);
}

if ( nconf.get('NODE_ENV') === 'test' ) {
	db.open('localhost', 'twittertest', 27017);
}

if ( nconf.get('NODE_ENV') === 'prod' ) {
	db.open('localhost', 'twitterprod', 27017);
}

// db.model('User', User);

module.exports = db;