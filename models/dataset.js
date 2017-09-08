var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var schema = require('../schemas/dataset');

module.exports = mongoose.model('Dataset', schema);
