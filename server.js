
var express = require('express'),
	bodyParser = require('body-parser'),
	app = express();

// ENVIRONMENT CONFIG
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
	envConfig = require('./server/env')[env];

// EXPRESS CONFIG
app.use(bodyParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// ROUTES
require('./server/routes')(app)

// Start server
app.listen(envConfig.port, function(){
  console.log('Server listening on port ' + envConfig.port)
});