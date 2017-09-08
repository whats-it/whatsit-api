var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Image = require('./image');

var userSchema = new Schema({
  login: String,
  avatarUrl: String,
  email: String,
  oauthProvider: String,
  oauthUserId: String,
  Images: [Image],
  markingCount: Number
});

module.exports = userSchema;
