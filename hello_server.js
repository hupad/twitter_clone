var http = require("http");

var server = http.createServer(handleRequest);

function handleRequest(request, response) {

	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end("Hello!");

}

server.listen(3000, '127.0.0.1');

module.exports = server;