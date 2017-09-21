var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objectSchema = new Schema({
  label: String, //  ObjectId of LabelItem(label_item.js)
  type: String, //polygon, circle(include ellipse)
  pose: {
    type: String, //Unspecified, Left, Right, Frontal, Rear
    default: "Unspecified"
  },
  truncated: {
    type: Number,
    default: 0
  },
  occluded: {
    type: Number,
    default: 0
  },
  difficult: {
    type: Number,
    default: 0
  },
  polygons: [[Number, Number]], //좌표
  x: Number,
  y: Number,
  w: Number,
  h: Number
});

module.exports = objectSchema;
