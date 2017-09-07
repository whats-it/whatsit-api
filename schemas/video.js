var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Image = require('./image')

var videoSchema = new Schema({
  name: String,
  source: String, //Original video url
  frames: String, //Zip of extracted frame images file url (e.g. http://xxx.xxx/yyy/aaa.zip
  sections:[{Number, Number}], // [{start time, end time}]
  images:[Image]
});

module.exports = videoSchema;
