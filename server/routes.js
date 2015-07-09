var express = require('express'),
	path = require('path'),
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

	apiRouter.post('/login', function(req, res){

	});

	app.use('/api', apiRouter);	// haven't built any api yet
	app.use('/', router);
};