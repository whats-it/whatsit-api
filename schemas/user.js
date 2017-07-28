var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  login: String,
  avatarUrl: String,
  email: String,
  oauthProvider: String,
  oauthUserId: String
});

module.exports = userSchema;
