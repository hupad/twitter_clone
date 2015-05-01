var express = require('express')
var router = express.Router();
var ensureAuthentication = require('../../middleware/ensureAuthentication');
var conn = require('../../db');
var moment = require('moment');

router.get('/', function(request, response){
	
	var userId = request.query.userId;;
	var data = { tweets: [] };
	Tweet = conn.model('Tweet');

	if (userId) {
		Tweet.find({'userId': userId}, function(err, tweets) {
			if (tweets) {
				for (var i = tweets.length - 1; i >= 0; i--) {
					data.tweets.push(tweets[i].toClient());
				}
				return response.send(data);
			}
		});
	}else{
		return response.sendStatus(400);
	}

});

router.post('/', ensureAuthentication, function(request, response){
	
	var data = { tweet: {} };
	var request_tweet = request.body.tweet;

	Tweet = conn.model('Tweet');
	var tweet = new Tweet({
		'text': request.body.tweet.text,
		'userId': request.user.id,
		'created': moment().unix()
	});
	
	tweet.save(tweet, function(err){
		if (!err) {
			data.tweet = tweet.toClient();
			return response.send(data);
		}
	});

});

router.get('/:tweetId', function(request, response){
	
	var tweetId = request.params.tweetId;
	var data = {tweet: {}};

	Tweet = conn.model('Tweet');

	Tweet.findById(tweetId, function(err, tweet) {
		if (tweet) {
			data.tweet.id = tweet._id;
			data.tweet.userId = tweet.userId;
			data.tweet.created = tweet.created;
			data.tweet.text = tweet.text;

			return response.send(data);
		}else{
			return response.sendStatus(404);
		}
	});
});

router.delete('/:tweetId', ensureAuthentication, function(request, response){
	
	var tweetId = request.params.tweetId;
	var index = -1;

	Tweet = conn.model('Tweet');

	if (tweetId) {
		Tweet.findById(tweetId, function(err, tweet) {
			if (tweet) {
				if (tweet.userId === request.user.id) {
					tweet.remove(tweetId, function(err, deletedTweet){
						return response.sendStatus(200);
					});
				}else{
					return response.sendStatus(403);
				}
			}else{
				return response.sendStatus(404);
			}
		});
	}else{
		return response.sendStatus(404);
	}
});

module.exports = router;