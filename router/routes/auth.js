var express = require('express')
	, router = express.Router()


router.post('/login', function(request, response, next){
	passport.authenticate('local', function(err, user, info) {
		var data = {}
	    if (err) { return next(err); }
	    if (!user) { return response.sendStatus(403); }
	    request.logIn(user, function(err) {
	      if (err) { return next(err); }
	      	data['user'] = user.toClient();
	      	return response.send(data);
	    });
	})(request, response, next);
});

router.post('/logout', function(request, response, next){
	request.logout();
	response.sendStatus(200);
});

module.exports = router;