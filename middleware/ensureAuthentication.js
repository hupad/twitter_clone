module.exports = function (request, response, next) {
	if (!request.isAuthenticated()) {
		response.sendStatus(403);
	}else{
		next();
	}
}