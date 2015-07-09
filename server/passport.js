// requires the model with Passport-Local Mongoose plugged in
var User = require('./models/user'),
	LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
	// use static authenticate method of model in LocalStrategy
	passport.use(User.createStrategy());

	// use static serialize and deserialize of model for passport session support
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());
};
