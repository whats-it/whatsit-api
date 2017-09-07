var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var schema = require('../schemas/rawImage');

module.exports = mongoose.model('RawImage', schema);
