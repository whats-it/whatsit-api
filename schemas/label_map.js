var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LabelItem = require('./label_item');

var labelMapSchema = new Schema({
  items: [LabelItem]
});

module.exports = labelMapSchema;
