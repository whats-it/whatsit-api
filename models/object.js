var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var schema = require('../schemas/object');

module.exports = mongoose.model('Object', schema);
