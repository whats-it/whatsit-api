var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var boxSchema = new Schema({
  labels: [String],
  type: String, //rect, circle
  imageId: ObjectId,
  x: Number,
  y: Number,
  w: Number,
  h: Number
});

module.exports = boxSchema;
