var Project = require('../models/project');
var Scheduler = require('../models/scheduler');
var config = require('../config.json')
var AwPubSub = require('whatsit-pubsub')

var bunyan = require('bunyan')
var scheduler = require('./scheduler');
let log = bunyan.createLogger({name:'whatsit-api', module: 'schedule'})

function createProject (user, data) {
  console.log('createProject')
  console.log(user)
  console.log(data)
  data.owner = user
  return new Promise((resolve, reject) => {
    Project.findOneAndUpdate(
      { "owner": user,
        "name": data.name
      },
      {$set:data
      },
      {upsert: true, new: true},
      function(err, project) {
        if (err) {
          console.error(err)
          reject(err)
        }
        console.log('createProject done: ')
        console.log(project)
        resolve(project)
      }
    )
  })
}


function updateProject (projectId, data) {
  console.log('updateProject')
  console.log(projectId)
  return new Promise((resolve, reject) => {
    Project.findOneAndUpdate(
      {"_id": projectId
      },
      {$set: data
      },
      {upsert: true, new: true},
      function(err, data) {
        if (err) {
          console.error(err)
          reject(err)
        }
        // console.log('updateInstance done: ' + instance._id)
        resolve(data)
        // if (data.status == "PASS" || data.status == "FAIL" || data.status == "BROKEN") {
        //   sendNotification(instance)
        // }
      })
  })
}

function deleteEmailSubscriber (projectId, email) {
  console.log('deleteEmailSubscriber: ' + email)
  return new Promise((resolve, reject) => {
    Project.update({"_id": projectId},
      { "$pull": { "subscriber": email }},
      { safe: true, multi:true },
      function(err, obj) {
        if (err) {
          reject(err)
        } else {
          console.log(obj)
          let res = {}
          res.msg = `${email} is successfully deleted`
          res.status = "SUCCESS"
          if (obj.nModified == 0) {
            res.status = "FAIL"
            res.msg = `Can not find ${email}`
          }
          resolve(res)
        }
      });
  })
}

function addMember (projectId, user) {
  return new Promise((resolve, reject) => {
    Project.findOneAndUpdate(
      {"_id": projectId
      },
      {$addToSet: {member: user}
      },
      {upsert: true, new: true},
      function(err, data) {
        if (err) {
          console.error(err)
          reject(err)
        }
        resolve(data)
      })
  })
}

function getProjectByProjectId (id) {
  return new Promise((resolve, reject) => {
    Project.findOne(
      {"_id": id},
      function(err, project) {
        if (err) {
          console.error(err)
          reject(err)
        }
        console.log(project)
        resolve(project)
      }
    )
  })
}

function deleteProjectByProjectId (id) {
  return new Promise((resolve, reject) => {
    Project.findByIdAndRemove(id, function (err, res) {
      if (err) {
        console.error(err)
        reject(err)
      }
      resolve()
    });
  })
}

function getProjectsByUserId (id) {
  return new Promise((resolve, reject) => {
    Project.find(
      {"owner._id": id},
      function(err, projects) {
        if (err) {
          console.error(err)
          reject(err)
        }
        console.log(projects)
        resolve(projects)
      }
    )
  })
}



exports.createProject = createProject
exports.deleteEmailSubcriber = deleteEmailSubscriber
exports.getProjectByProjectId = getProjectByProjectId
exports.deleteProjectByProjectId = deleteProjectByProjectId
exports.getProjectsByUserId = getProjectsByUserId
exports.addMember = addMember
