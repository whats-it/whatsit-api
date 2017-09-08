var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Image = require('./image')

var videoSchema = new Schema({
  name: String,
  source: String, //Original video url
  sections:[[Number, Number]], // [[start time(sec), end time(sec)]]
  frames: String, //Zip of extracted frame images file url (e.g. http://xxx.xxx/yyy/aaa.zip
  images:[Image],
  datasetId: Object
});

module.exports = videoSchema;
