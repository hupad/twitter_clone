var express = require('express');
var router = express.Router();
var ensureAuthentication = require('../../middleware/ensureAuthentication');
var conn = require('../../db');

router.get('/:userId', function(request, response){		
	var data = {user: {}};	
	var userId = request.params.userId;
	User = conn.model('User');

	User.findOne({'id': userId}, function(err, user) {
		if (!err) {
			data.user = user.toClient();
			return response.send(data);
		}
	})

});

router.put('/:userId', ensureAuthentication, function(request, response) {
	
	var userId = request.params.userId;
	var updatedPassword = request.body.password;
	User = conn.model('User');

	if (request.user.id === userId) {
		User.findOneAndUpdate({'id': userId}, {'password': updatedPassword}, null, function(err, user) {
			if (!err) {
				return response.sendStatus(200);
			}
		});
	}else{
		return response.sendStatus(403);
	}
});

router.post('/', function(request, response){

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
		if (err) { return response.sendStatus(409); }
		request.login(user, function(err) {
			return response.send(user.toClient());
		});
	});
});

module.exports = router;