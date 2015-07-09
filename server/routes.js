var express = require('express'),
	path = require('path'),
	passport = require('passport'),
	User = require('./models/user'),
	rootPath = path.normalize(__dirname + '/../'),
	apiRouter = express.Router(),
	router = express.Router();

module.exports = function(app){	

	// home route
	router.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// admin route
	router.get('/admin', function(req, res) {
		res.render('admin.ejs');
	});

	apiRouter.post('/register', function(req, res){

		// passport-local-mongoose: Convenience method to register a new user instance with a given password. Checks if username is unique
		User.register(new User({
			email: req.body.email
		}), req.body.password, function(err, user) {
	        if (err) {
	            console.error(err);
	            return;
	        }
	        console.log(user);

	        // log the user in after it is created
	        passport.authenticate('local')(req, res, function(){
	        	res.json(user);
	        });
	    });
	});

	apiRouter.post('/login', passport.authenticate('local'), function(req, res){
		console.log(req.user);

		res.json(req.user);
	});

	app.use('/api', apiRouter);	// haven't built any api yet
	app.use('/', router);
};