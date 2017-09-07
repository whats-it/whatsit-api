var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objectSchema = new Schema({
  label: String,
  type: String, //polygon, circle(include ellipse)
  pose: String, //Unspecified(default), Left, Right, Frontal, Rear
  truncated: Number,
  occluded: Number,
  difficult: Number,
  polygons: [[Number, Number]], //좌표
  x: Number,
  y: Number,
  w: Number,
  h: Number
});

module.exports = objectSchema;
