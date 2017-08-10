var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var connectS3Schema = new Schema({
  type: String, //e.g. S3, DropBox
  endpoint: String, //e.g. s3://xxx/xxx
  accessKeyId: String,
  accessKeySecret: String,
  region: String,
  sourceBucket: String,
  destBucket: String
});

module.exports = connectS3Schema;
