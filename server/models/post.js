var mongoose = require('mongoose');

var postSchema = {
	title: { type: String, required: '{PATH} is required!'},
	body: { type: String, required: '{PATH} is required!'},
	published: { type: Boolean, required: '{PATH} is required!'}
};

module.exports = mongoose.model('Post', postSchema);