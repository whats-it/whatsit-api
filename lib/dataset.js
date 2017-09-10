var Project = require('../models/project');
var Dataset = require('../models/dataset');
var Video = require('../models/Video');

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

exports.addDataset = addDataset;
exports.getDatasetsByProjectId = getDatasetsByProjectId;