var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var exportSchema = new Schema({
  createdAt: Number,
  uri: String
});

module.exports = exportSchema;
