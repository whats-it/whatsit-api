var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var schema = require('../schemas/image');

module.exports = mongoose.model('Image', schema);
