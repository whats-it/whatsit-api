var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Object = require('./object')

var imageSchema = new Schema({
  name: String,
  uri: String,
  labels: [String],
  objects: [Object],
  segmented: {
    type: Number,
    default: 0
  },
  checkedCount: Number
});

module.exports = imageSchema
