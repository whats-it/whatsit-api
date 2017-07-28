var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var connectSchema = new Schema({
  name: String, //e.g. S3, DropBox
  endpoint: String, //e.g. s3://xxx/xxx
  accessToken: String,
  accessKeyId: String,
  accessKeySecret: String,
  sourceBucket: String,
  destBucket: String
});

module.exports = connectSchema;
