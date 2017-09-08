var Project = require('../models/project');
var Dataset = require('../models/dataset');
var Video = require('../models/Video');

function addDataset(data) {
  return new Promise((resolve, reject) => {
    if (data.projectId == null || data.projectId == 'undefined') {
      reject('projectId is Invalid');
    } else {
      console.log('data.projectId =>' + data.projectId);

      var videoId = '';
      var datasetId = '';

      var video = new Video({
        name: data.video.name,
        source: data.video.source,
        sections: data.video.sections,
        frames: data.video.frames,
        images: data.video.images
      })
      video.save(function (err, result) {
        if (err) {
          console.log('video err =>' + err);
        }
        videoId = result._id;
        console.log('videoId=>' + videoId);

        var dataset = new Dataset({
          name: data.name,
          desc: data.desc,
          thumbnail: data.thumbnail,
          status: data.status,
          type: data.type,
          data: [videoId]
        })
        console.log('dataset=>' + dataset);
        dataset.save(function (err, result2) {
          if (err) {
            console.log('dataset err =>' + err);
          }
          datasetId = result2._id;
          console.log('datasetId =>' + datasetId);
          Project.findOneAndUpdate(
            {
              "_id": data.projectId
            },
            {
              $addToSet: {datasets: datasetId}
            },
            {upsert: true, new: true},
            function (err, data) {
              if (err) {
                console.error(err)
                reject(err);
              }else {
                resolve('Success addDataset API');
              }
            })
        });
      });
    }
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
      resolve(getDatasets(projects.datasets));
    })
  })
}

function getDatasets(datasets) {
  return new Promise((resolve, reject) => {
    Dataset.find({ _id: { $in : datasets}
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
exports.addDataset = addDataset;
exports.getDatasetsByProjectId = getDatasetsByProjectId;