var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Box = require('./box')

var imageSchema = new Schema({
  name: String,
  type: String,
  projectId: ObjectId,
  uri: String,
  source: String,
  labels: [String],
  boxes: [Box]
});


module.exports = imageSchema;
