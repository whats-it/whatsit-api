var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objectSchema = new Schema({
  label: String,
  type: String, //polygon, circle(include ellipse)
  polygons: [[Number, Number]], //좌표
  x: Number,
  y: Number,
  w: Number,
  h: Number
});

module.exports = objectSchema;
