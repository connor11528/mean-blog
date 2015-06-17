var express = require('express'),
	router = express.Router();

module.exports = function(app){	

	
	// angularjs catch all route
	router.get('/*', function(req, res) {
		res.sendfile('./public/index.html');
	});

	app.use('/', router);
};