var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * by k_one
 * whatsit-schedule-crop가 동작 후
 * 사용 되는 crop된 이미지 스키마
 * */
var singleImageSchema = new Schema({
  name: String,
  uri: String,
  source: ObjectId, //원본
  label: String,
  w: Number, //이미지 사진에 대한
  h: Number
});


module.exports = singleImageSchema ;
