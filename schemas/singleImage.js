var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// Cropped single object image
var singleImageSchema = new Schema({
  name: String,
  uri: String,
  imageId: ObjectId, //Parent Image
  label: String,
  w: Number, //width
  h: Number  //height
});

module.exports = singleImageSchema ;
