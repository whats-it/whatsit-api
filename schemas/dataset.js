var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var datasetSchema = new Schema({
  name: String,
  thumbnail: String, //Thumbnail image url
  status: String, //Preparing, Live, Stop
  type: String, //g-spreadsheet, video
  member: [ObjectId], //[User]
  data: [ObjectId] // image or video
});

module.exports = datasetSchema;
