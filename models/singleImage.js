var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var schema = require('../schemas/singleImage');

module.exports = mongoose.model('SingleImage', schema);
