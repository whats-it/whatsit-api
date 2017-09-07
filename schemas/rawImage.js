var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Object = require('./object')


/**
 * by k_one
 * image 원본 스키마
 * */
var rawImageSchema = new Schema({
  name: String,
  imageId: ObjectId,
  uri: String,
  labels: [String],
  objects: [Object],
  checkedCount: Number
});


module.exports = rawImageSchema
