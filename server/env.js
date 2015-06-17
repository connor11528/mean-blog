var path = require('path'),
	rootPath = path.normalize(__dirname + '/../../');
	console.log(rootPath);

module.exports = {
	development: {
		rootPath: rootPath,
		port: process.env.PORT || 3000
	},
	production: {
		rootPath: rootPath,
		port: process.env.PORT || 80
	}
};