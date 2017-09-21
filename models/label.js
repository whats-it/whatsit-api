var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var schema = require('../schemas/label_item');

module.exports = mongoose.model('Label', schema);
