
var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
	cors = require('cors'),
	app = express();

// ENVIRONMENT CONFIG
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
	envConfig = require('./server/env')[env];

mongoose.connect(envConfig.db);

// PASSPORT CONFIG
require('./server/passport')(passport);

// EXPRESS CONFIG
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(methodOverride());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());

// ROUTES
require('./server/routes')(app);

// Start server
app.listen(envConfig.port, function(){
  console.log('Server listening on port ' + envConfig.port)
});