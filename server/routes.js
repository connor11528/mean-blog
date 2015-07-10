var express = require('express'),
	path = require('path'),
	User = require('./models/user'),
	rootPath = path.normalize(__dirname + '/../'),
	apiRouter = express.Router(),
	router = express.Router();

module.exports = function(app, passport){	

	// home route
	router.get('/', function(req, res) {
		res.render('index');
	});

	// admin route
	router.get('/admin', function(req, res) {
		res.render('admin');
	});

	router.get('/dashboard', isAdmin, function(req, res){
		res.render('dashboard', {user: req.user});
	});

	router.post('/register', function(req, res){

		// passport-local-mongoose: Convenience method to register a new user instance with a given password. Checks if username is unique
		User.register(new User({
			email: req.body.email
		}), req.body.password, function(err, user) {
	        if (err) {
	            console.error(err);
	            return;
	        }

	        // log the user in after it is created
	        passport.authenticate('local')(req, res, function(){
	        	console.log('authenticated by passport');
	        	res.redirect('/dashboard');
	        });
	    });
	});

	router.post('/login', passport.authenticate('local'), function(req, res){
		res.redirect('/dashboard');
	});

	app.use('/api', apiRouter);	// haven't built any api yet
	app.use('/', router);
};

function isAdmin(req, res, next){
	if(req.isAuthenticated() && req.user.email === 'connorleech@gmail.com'){
		console.log('cool you are an admin, carry on your way');
		next();
	} else {
		console.log('You are not an admin');
		res.redirect('/admin');
	}
}