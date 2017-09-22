var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var User = require('./user');


var projectSchema = new Schema({
  name: String,
  desc: String,
  owner: User,
  thumbnail: String, //Thumbnail image url
  status: String, //preparing, live, stop
  member: [ObjectId],
  datasets: [ObjectId], //[Dataset]
  exports: [ObjectId], //export schema
  label_map: ObjectId //LabelMap
});


class ProjectClass {
  // example
  // // `fullName` becomes a virtual
  // get fullName() {
  //   return `${this.firstName} ${this.lastName}`;
  // }
  //
  // set fullName(v) {
  //   const firstSpace = v.indexOf(' ');
  //   this.firstName = v.split(' ')[0];
  //   this.lastName = firstSpace === -1 ? '' : v.substr(firstSpace + 1);
  // }
  //
  // // `getFullName()` becomes a document method
  // getFullName() {
  //   return `${this.firstName} ${this.lastName}`;
  // }
  //
  // // `findByFullName()` becomes a static
  // static findByFullName(name) {
  //   const firstSpace = name.indexOf(' ');
  //   const firstName = name.split(' ')[0];
  //   const lastName = firstSpace === -1 ? '' : name.substr(firstSpace + 1);
  //   return this.findOne({ firstName, lastName });
  // }
}

projectSchema.loadClass(ProjectClass);

module.exports = projectSchema;
