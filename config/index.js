var nconf = require('nconf');
var path = require('path');

nconf.env();

if (nconf.get('NODE_ENV') === 'dev') {
	nconf = nconf.file( path.join(__dirname, 'config-dev.json') );
}

if (nconf.get('NODE_ENV') == 'test') {
	nconf = nconf.file( path.join(__dirname, 'config-test.json') );
};

if (nconf.get('NODE_ENV') == 'prod') {
	nconf = nconf.file( path.join(__dirname, 'config-prod.json') );
};

module.exports = nconf;