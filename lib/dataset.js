var Project = require('../models/project');
var Dataset = require('../models/dataset');
var Video = require('../models/Video');
var Image = require('../models/Image');
var Object = require('../models/object');
var LABEL = require('../models/label');
var forEach = require('foreach-async')

function addDataset(body) {
    return new Promise((resolve, reject) => {
        if (body.projectId == null || body.projectId == 'undefined') {
            reject('projectId is Invalid');
        } else {
            console.log('addDataset body =>' + JSON.stringify(body,null,2))
            console.log('body.projectId =>' + body.projectId);
            console.log('body.type =>' + body.type);

            if (body.type == 'video') {

              if (body.data[0].source == null) {
                reject('video source is null');
              }
                insertVideo(body)
                    .then((videoId) => insertDataset(videoId, body))
                    .then((datasetId) => updateProjectDatasets(body.projectId, datasetId))
                    .then((result) => {
                        resolve(result);
                    })
            } else {

              //TODO: another type
              reject('dataset type is not video!');
            }
        }
    })
}

function insertVideo(body) {
    return new Promise((resolve, reject) => {
        var video = new Video({
            name: body.data[0].name,
            source: body.data[0].source,
            sections: body.data[0].sections,
        })
        video.save(function (err, result) {
            if (err) {
                console.log('video err =>' + err);
                reject(err);
            }
            var videoId = result._id;
            console.log('videoId=>' + videoId);
            resolve(videoId);
        })
    })
}

function insertDataset(videoId, body) {
    return new Promise((resolve, reject) => {
        var dataset = new Dataset({
            name: body.name,
            desc: body.desc,
            thumbnail: body.thumbnail,
            status: body.status,
            type: body.type,
            data: [videoId]
        })
        console.log('dataset=>' + dataset);
        dataset.save(function (err, result) {
            if (err) {
                console.log('dataset err =>' + err);
                reject(err);
            }
            var datasetId = result._id;

            if (datasetId != null ||
              datasetId != undefined) {
              console.log('datasetId =>' + datasetId);
              resolve(datasetId)
            } else {
              reject('datasetId is null in insertDataset func');
            }

        })
    })
}

function updateProjectDatasets(projectId, datasetId) {
    return new Promise((resolve, reject) => {
        Project.findOneAndUpdate(
            {
                "_id": projectId
            },
            {
                $addToSet: {datasets: datasetId}
            },
            {upsert: true, new: true},
            function (err, data) {
                if (err) {
                    console.error(err)
                    reject(err);
                } else {
                    resolve({"projectId": projectId, "datasetId": datasetId});
                }
            })
    })
}

function getDatasetsByProjectId(id) {
    return new Promise((resolve, reject) => {
        Project.findOne({
            "_id": id
        }).exec(function (err, projects) {
            if (err) {
                console.error(err)
                reject(err)
            }

            console.log('projects =>' + projects);
            if (projects == null) {
              reject('datasets is null in project');
            }

            var datasetsIds = projects.datasets;
            getDatasetsByDatasetsId(datasetsIds)
                .then((result) => {
                    resolve(result)
                });
        })
    })
}

function getDatasetsByDatasetsId(ids) {
    return new Promise((resolve, reject) => {
        Dataset.find({
            _id: {$in: ids}
        })
            .exec(function (err, datasetItems) {
                if (err) {
                    console.error(err)
                    reject(err)
                }
                console.log('datasetItems =>' + datasetItems);
                resolve(datasetItems)
            })
    })
}

function getDatasetByDatasetId(id) {
  return new Promise((resolve, reject) => {
    Dataset.findOne({
      "_id": id
    }).exec(function (err, dataset) {
      if (err) {
        console.error(err)
        reject(err)
      }

      var resultJson = {};
      var dataIds = dataset.data;
      var datasetType = dataset.type;
      console.log('dataIds =>' + dataIds);
      console.log('datasetType =>' + datasetType);

      resultJson.name = dataset.name;
      resultJson.desc = dataset.desc;
      resultJson.thumbnail = dataset.thumbnail;
      resultJson.status = dataset.thumbnail;
      resultJson.type = dataset.type;

      if (datasetType == 'video') {

        getVideoByObjectId(dataIds[0])
          .then( (video) => {

            resultJson.data = [video];

            if (video.images.length === 0) {
              console.log('video.images is null')
              resolve(resultJson);
            }

            getImagesByObjectIds(video.images)})
          .then( (images) => {

            resultJson.data.images = [images];
            resolve(resultJson)
          })
      } else if (datasetType == 'images') {

        getImagesByObjectIds(dataIds)
          .then( (images) => {

            resultJson.data.images = [images];
            resolve(resultJson)
          })
      } else {
        //another ..
        reject('type field is invalid!');
      }

    })
  })
}

function getVideoByObjectId(id) {
  return new Promise((resolve, reject) => {
    Video.findOne({
      "_id": id
    })
      .exec(function (err, videoItem) {
        if (err) {
          console.error(err)
          reject(err)
        }
        console.log('videoItem =>' + videoItem);
        resolve(videoItem)
      })
  })
}

function getImagesByObjectIds(ids) {
  return new Promise((resolve, reject) => {
    Image.find({
      "_id": {$in: ids}
    })
      .exec(function (err, imageItems) {
        if (err) {
          console.error(err)
          reject(err)
        }
        console.log('imageItems =>' + imageItems);
        resolve(imageItems)
      })
  })
}

function getObjectsByImageIds(ids) {
  return new Promise((resolve, reject) => {
    Object.find({
      "_id": {$in: ids}
    })
      .exec(function (err, objectItems) {
        if (err) {
          console.error(err)
          reject(err)
        }
        console.log('objectItems =>' + objectItems);
        resolve(objectItems)
      })
  })
}

function updateDatasetByDatasetId(id, body) {
  return new Promise((resolve, reject) => {
    console.log('update Dataset id=>' + id);

    var datasetJson = {};
    if (body.name != null)
      datasetJson.name = body.name;
    if (body.desc != null)
      datasetJson.desc = body.desc;
    if (body.thumbnail != null)
      datasetJson.thumbnail = body.thumbnail;

    Dataset.findOneAndUpdate(
      {"_id": id
      },
      {$set: datasetJson
        //can't change dataset data schema
      },
      {upsert: false, new: true},
      function(err, result) {
        if (err) {
          console.error(err)
          reject(err)
        }
        console.log('result =>' + result)

        if (body.type == "video") {

          if (result.data[0] == undefined ||
            result.data[0].length === 0) {
            reject('data is null in dataset');
          }

          updateVideoByObjectId(result.data[0], body.data[0])
            .then( (result) => {
              getImagesObjectLabelList(body.data[0].images);
              resolve(result);
            })
        } else if (body.type == "images") {
          //TODO: images updates
        } else {
          //etc ..
          reject('type is not video !');
        }
      })
  })
}

function getImagesObjectLabelList(images) {
  return new Promise((resolve, reject) => {
    var labels = [];

    console.log('images length =>' + images.length);
    for (var i = 0; i < images.length; i ++) {
      for (var j = 0; j < images.objects.label.length; j ++) {

        labels.push(images[i].objects[j].label);
        break;
      }
    }



    if (labels.length === 0) {

      reject('labels is empty');
    } else {
      console.log('labes =>' + labels);
      resolve(labels);
    }
  })
}

function updateVideoByObjectId(id, data) {
  return new Promise((resolve, reject) => {
    console.log('update videoId=>' + id);

    Video.findOneAndUpdate(
      {"_id": id
      },
      {$set: data
      },
      {upsert: false, new: true},
      function(err, result) {
        if (err) {
          console.error(err)
          reject(err)
        }
        console.log('result =>' + result._id)
        resolve({videoId:result._id})
      })
  })
}

function allDatasetByProject(project) {
  return new Promise( (resolve, reject) => {
    console.log('project =>' + JSON.stringify(project));

    if (project == null) {
      reject('project is null');
    }

    var projectResultJson = {};

    projectResultJson.name = project.name;
    projectResultJson.desc = project.desc;
    projectResultJson.owner = project.owner;
    projectResultJson.thumbnail = project.thumbnail;
    projectResultJson.status = project.status;
    projectResultJson.member = project.member;
    projectResultJson.exports = project.exports;
    projectResultJson.label_map = project.label_map;

    forEach( project.datasets, function (value, index, array) {

      getDatasetByDatasetId(value)
        .then ( (result) => {
          this.done(result);
        })
    }, function (results) {
      // console.log('results =>'+ JSON.stringify(results));
      projectResultJson.datasets = results;
      resolve(projectResultJson);
    })


  })
}
exports.addDataset = addDataset;
exports.getDatasetsByProjectId = getDatasetsByProjectId;
exports.getDatasetByDatasetId = getDatasetByDatasetId;
exports.updateVideoByObjectId = updateVideoByObjectId;
exports.updateDatasetByDatasetId = updateDatasetByDatasetId;
exports.allDatasetByProject = allDatasetByProject;