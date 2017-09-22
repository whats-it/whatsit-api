var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var exportSchema = new Schema({
  createdAt: Number,
  uri: String,
  format: String
});

module.exports = exportSchema;
