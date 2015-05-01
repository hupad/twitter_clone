
var express = require('express');
var fixtures = require('./fixtures.js');

var config = require('./config');

var app = express();

require('./middleware')(app);
require('./router')(app);


var server = app.listen(config.get('server:port'), config.get('server:host'), function(request, response){
});


module.exports = server;