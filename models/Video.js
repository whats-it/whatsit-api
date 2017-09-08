var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var schema = require('../schemas/video');

module.exports = mongoose.model('Video', schema);
