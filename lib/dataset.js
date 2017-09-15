var Project = require('../models/project');
var Dataset = require('../models/dataset');
var Video = require('../models/Video');
var Image = require('../models/Image');
var Object = require('../models/object');
var forEach = require('foreach-async')

function addDataset(body) {
    return new Promise((resolve, reject) => {
        if (body.projectId == null || body.projectId == 'undefined') {
            reject('projectId is Invalid');
        } else {
            console.log('body.projectId =>' + body.projectId);
            console.log('body.type =>' + body.type);

            if (body.type == 'video') {

                insertVideo(body)
                    .then((videoId) => insertDataset(videoId, body))
                    .then((datasetId) => updateProjectDatasets(body.projectId, datasetId))
                    .then((result) => {
                        resolve(result);
                    })
            }
        }
    })
}

function insertVideo(body) {
    return new Promise((resolve, reject) => {
        var video = new Video({
            name: body.data.name,
            source: body.data.source,
            sections: body.data.sections,
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
            console.log('datasetId =>' + datasetId);
            resolve(datasetId)
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
            var datasetsIds = projects.datasets
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

            if (video.images == "") {
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

function updateVideoByObjectId(id, data) {
  return new Promise((resolve, reject) => {
    console.log('update videoId=>' + id);
    Video.findOneAndUpdate(
      {"_id": id
      },
      {$set: data
      },
      {upsert: true, new: true},
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
      projectResultJson.datasets = [results];
      resolve(projectResultJson);
    })


  })
}
exports.addDataset = addDataset;
exports.getDatasetsByProjectId = getDatasetsByProjectId;
exports.getDatasetByDatasetId = getDatasetByDatasetId;
exports.updateVideoByObjectId = updateVideoByObjectId;
exports.allDatasetByProject = allDatasetByProject;