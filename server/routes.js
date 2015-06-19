var express = require('express'),
	path = require('path'),
	passport = require('passport'),
	rootPath = path.normalize(__dirname + '/../'),
	apiRouter = express.Router(),
	router = express.Router();

module.exports = function(app){	

	// API ROUTES
	// angular hits this
	apiRouter.get('/login', passport.authenticate('spotify'));

	// redirects to this
	apiRouter.get('/spotify/callback', 
		passport.authenticate('spotify', { failureRedirect: '/#/login' }),
		function(req, res){
			console.log("got allllll the way!!!");
			res.redirect('/#/');
		});

	// angularjs catch all route
	router.get('/*', function(req, res) {
		res.sendFile(rootPath + 'public/index.html', { user: req.user });
	});

	app.use('/api', apiRouter);
	app.use('/', router);
};