var RawImage = require('../models/Image')
var Project = require('../models/project')
var User = require('../models/user')

function getImagesByProjectId(id) {
  return new Promise((resolve, reject) => {
    Project.findOne({
      "_id": id
    }).exec(function (err, projects) {
      if (err) {
        console.error(err)
        reject(err)
      }
      resolve(getImages(projects.images));
    })
  })
}

function getImages(images) {
  return new Promise((resolve, reject) => {
    RawImage.find({ _id: { $in : images}
      })
        .sort({checkedCount: 1})
        .limit(100)
        .exec(function (err, imageItems) {
          if (err) {
            console.error(err)
            reject(err)
          }
          console.log('project image =>' + imageItems);
          resolve(imageItems)
        })
  })
}

function setImages(data) {
  return new Promise((resolve, reject) => {
    if (data.imageId == null || data.imageId == 'undefined') {
      reject('imageId is Invalid');
    } else {

      if (data.objects == null || data.objects == "") {

        reject('objects is null')
      } else {
        console.log('data.imageId =>' + data.imageId);
        RawImage.findOneAndUpdate(
          {"imageId": data.imageId
          },
          {$set:{"objects":data.objects}
          },
          {upsert: true, new: true},
          function(err , images) {
            if (err) {
              console.error(err)
              reject(err)
            }
            console.log(JSON.stringify(images.objects));
            resolve('Update images ok!')
          }
        )
        // RawImage.imageId = data.imageId;
        // RawImage.objects = data.objects;
        // RawImage.save(function (err) {
        //   if (err) {
        //     reject(err);
        //   } else {
        //     resolve('add images save ok!')
        //   }
        // })
      }
    }
  })
}

function updateUsermarkingCount(userId) {
  return new Promise((resolve, reject) => {
    if (userId == null || userId == 'undefined') {
      reject('userId is Invalid');
    } else {
      User.findOneAndUpdate(
        {"_id": userId
        },
        {$inc: {markingCount : 1}
        },
        {upsert: true, new: true},
        function(err, project) {
          if (err) {
            console.error(err)
            reject(err)
          }
          console.log(project.markingCount)
          resolve('Update image & Increase user markingCount ok!')
        })
    }
  })
}

exports.getImagesByProjectId = getImagesByProjectId;
exports.setImages = setImages;
exports.updateUsermarkingCount = updateUsermarkingCount;