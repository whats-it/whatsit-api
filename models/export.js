var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var schema = require('../schemas/export');

module.exports = mongoose.model('Export', schema);
