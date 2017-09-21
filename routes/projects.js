var express = require('express')
var router = express.Router();
var bunyan = require('bunyan')
var db = require('../utils/db')
var Response = require('../utils/response');
var RESP = require('../utils/response_values');
var response = new Response();
var config = require('../config.json')
var Project = require('../models/project');
var Instance = require('../models/instance');
var schedule = require('../lib/schedule')
var wiProject = require('../lib/project')
var wiUser = require('../lib/user')
var wiDataset = require('../lib/dataset')
var AwPubSub = require('whatsit-pubsub')
var AwResponse = require('../utils/AwResponse')

router.post('/', function(req, res){

    /**
     * TODO : checked user project duplication
     * */
    db.connectDB()
    .then( () => wiUser.getUserById(req.body.userId))
    .then( user => wiProject.createProject(user, req.body))
    .then( (project) => {
      var awResponse = new AwResponse();
      awResponse.code = 200;
      awResponse.data = project;
      res.json(awResponse.create())
    }).catch( function (error) {
      console.error(error)
      var awResponse = new AwResponse();
      awResponse.code = 500;
      awResponse.message = error;
      res.json(awResponse.create())
    })
});

router.post('/:projectId/member', function(req, res){

  var projectId = req.params.projectId;
  console.log('projectId =>' + projectId);

  if (projectId == null ||
    projectId == undefined) {

    var awResponse = new AwResponse();
    awResponse.code = 400;
    awResponse.message = "projectId is invalid";
    res.json(awResponse.create())
  }

  db.connectDB()
    .then( () => wiProject.addMember(req.params.projectId, req.body.userId))
    .then( (project) => {
      var awResponse = new AwResponse();
      awResponse.code = 200;
      awResponse.data = project;
      res.json(awResponse.create())
    }).catch( function (error) {
    console.error(error)
    var awResponse = new AwResponse();
    awResponse.code = 500;
    awResponse.message = error;
    res.json(awResponse.create())
  })
});

router.delete('/:projectId/member', function(req, res){

  var projectId = req.params.projectId;
  console.log('projectId =>' + projectId);

  if (projectId == null ||
    projectId == undefined) {

    var awResponse = new AwResponse();
    awResponse.code = 400;
    awResponse.message = "projectId is invalid";
    res.json(awResponse.create())
  }

  db.connectDB()
    .then( () => wiProject.deleteMember(req.params.projectId, req.query.userId))
    .then( (data) => {
      var awResponse = new AwResponse();
      awResponse.code = 200;
      awResponse.message = data.msg;
      awResponse.data = null;
      res.json(awResponse.create())
    }).catch( function (error) {
    console.error(error)
    var awResponse = new AwResponse();
    awResponse.code = 500;
    awResponse.message = error;
    res.json(awResponse.create())
  })
});


router.put('/:projectId', function(req, res){

  var projectId = req.params.projectId;
  console.log('projectId =>' + projectId);

  if (projectId == null ||
    projectId == undefined) {

    var awResponse = new AwResponse();
    awResponse.code = 400;
    awResponse.message = "projectId is invalid";
    res.json(awResponse.create())
  }
  db.connectDB()
    .then( () => wiProject.checkedProject(req.params.projectId, req.body))
    .then( (project) => {
      var awResponse = new AwResponse();
      awResponse.code = 200;
      awResponse.data = project;
      res.json(awResponse.create())
      // updateSchedule(project)
    }).catch( function (error) {
    console.error(error)
    var awResponse = new AwResponse();
    awResponse.code = 500;
    awResponse.message = error;
    res.json(awResponse.create())
  })
});

router.put('/:projectId/connect/:connectionName', function(req, res){
  db.connectDB()
    .then( () => wiProject.updateConnectS3(req.params.projectId, req.body))
    .then( (project) => {

      if (req.params.connectionName != null) {
        var connectionName = req.params.connectionName;
        console.log('connectionName => ' + connectionName);
        pubCreateImageIndex(connectionName, project);
      }

      var awResponse = new AwResponse();
      awResponse.code = 200;
      awResponse.data = project;
      res.json(awResponse.create())
    }).catch( function (error) {
    console.error(error)
    var awResponse = new AwResponse();
    awResponse.code = 500;
    awResponse.message = error;
    res.json(awResponse.create())
  })
});
function pubCreateImageIndex (connectionName, project) {
    let awPubSub = new AwPubSub()
    console.log('pubCreateSchedule =>' + project)
    awPubSub.nrp.emit('whatsit/schedule/connect:'+connectionName, JSON.stringify({ schedule: project }))
}

router.get('/:projectId', function(req, res){

  var projectId = req.params.projectId;
  console.log('projectId =>' + projectId);

  if (projectId == null ||
    projectId == undefined) {

    var awResponse = new AwResponse();
    awResponse.code = 400;
    awResponse.message = "projectId is invalid";
    res.json(awResponse.create())
  }

  db.connectDB()
  .then( () => wiProject.getProjectByProjectId(req.params.projectId))
  .then( (project) => {
    var awResponse = new AwResponse();
    awResponse.code = 200;
    awResponse.data = project;
    res.json(awResponse.create())
  }).catch( function (error) {
    console.error(error)
    var awResponse = new AwResponse();
    awResponse.code = 500;
    awResponse.message = error;
    res.json(awResponse.create())
  })
});

router.delete('/:projectId', function(req, res){

  var projectId = req.params.projectId;
  console.log('projectId =>' + projectId);

  if (projectId == null ||
    projectId == undefined) {

    var awResponse = new AwResponse();
    awResponse.code = 400;
    awResponse.message = "projectId is invalid";
    res.json(awResponse.create())
  }

  db.connectDB()
    .then( () => wiProject.deleteProjectByProjectId(req.params.projectId))
    .then( () => {
      var awResponse = new AwResponse();
      awResponse.code = 200;
      awResponse.data = {projectId:req.params.projectId};
      res.json(awResponse.create())
    }).catch( function (error) {
    console.error(error)
    var awResponse = new AwResponse();
    awResponse.code = 500;
    awResponse.message = error;
    res.json(awResponse.create())
  })
});

router.get('/', function(req, res){

  var userId = req.query.userId;
  db.connectDB()
    .then( () => wiProject.getProjectsByUserId(userId))
    .then( (projects) => {
      var awResponse = new AwResponse();
      awResponse.code = 200;
      awResponse.data = {projects: projects};
      res.json(awResponse.create())
  }).catch( function (error) {
    console.error(error)
    var awResponse = new AwResponse();
    awResponse.code = 500;
    awResponse.message = error;
    res.json(awResponse.create())
  })
});

router.get('/:projectId/trainset', function (req, res) {

  var projectId = req.params.projectId;
  var format = req.query.format;

  if (projectId == null ||
    projectId == undefined) {

    var awResponse = new AwResponse();
    awResponse.code = 400;
    awResponse.message = "projectId is invalid";
    res.json(awResponse.create())
  }

  db.connectDB()
    .then( () => wiProject.getProjectByProjectId(projectId))
    .then( (project) => wiDataset.allDatasetByProject(project))
    .then( (result) => {

      if (format == "pascalvoc") {

        let awPubSub = new AwPubSub()
        console.log('publish :whatsit/export/pascalvoc');
        awPubSub.nrp.emit('whatsit/export/pascalvoc', JSON.stringify(result));
      }
      var awResponse = new AwResponse();
      awResponse.code = 200;
      awResponse.data = result;
      res.json(awResponse.create())
    }).catch( function (error) {
    console.error(error)
    var awResponse = new AwResponse();
    awResponse.code = 500;
    awResponse.message = error;
    res.json(awResponse.create())
  })
})


function deleteInstancesByProjectId (projectId) {
  return new Promise((resolve, reject) => {
    Instance.remove(
      {
        "project.projectId": projectId
      }, function (err, res) {
      if (err) {
        console.error(err)
        reject(err)
      }
      resolve()
    });
  })
}



module.exports = router;
