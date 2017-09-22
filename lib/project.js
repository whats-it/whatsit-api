var Project = require('../models/project');
var Export = require('../models/export');
var Scheduler = require('../models/scheduler');
var config = require('../config.json')

var bunyan = require('bunyan')
var scheduler = require('./scheduler');
let log = bunyan.createLogger({name:'whatsit-api', module: 'schedule'})

function createProject (user, data) {
  console.log('createProject')
  console.log('user =>' + user)
  console.log(data)

  data.owner = user
  return new Promise((resolve, reject) => {
    Project.findOneAndUpdate(
      {
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
        resolve({projectId:project._id,
                userId:user._id,
                projectName:project.name})
      }
    )
  })
}

function checkedProject (projectId, body) {
  console.log('updateProject')
  console.log(projectId)

  return new Promise((resolve, reject) => {
    console.log('body export = >' + body.exports.length)
    if (body.exports.length === 0) {
      updateProject(projectId, body)
        .then( (result) => {
          resolve(result);
        })
    } else {
      updateExport(body)
        .then( (data) => updateProject(projectId, data))
        .then( (result) => {
          resolve(result);
        })
    }
  });
}

function updateExport(body) {
  return new Promise((resolve, reject) => {

    var createAt = fetch_unix_timestamp();
    var createExport = new Export({
      uri: body.exports.uri,
      format: body.exports.format,
      createAt: createAt
    })
    createExport.save(function (err, result) {
      if (err) {
        console.log('createExport err =>' + err);
        reject(err);
      }
      var exportId = result._id;
      console.log('exportId=>' + exportId);

      body.exports = exportId;
      console.log('updateExport body =>' + JSON.stringify(body));
      resolve(body);
    })
  });
}

var fetch_unix_timestamp = function() {
  return Math.floor(new Date().getTime() / 1000);
}

function updateProject(projectId, body) {
  return new Promise((resolve, reject) => {
    Project.findOneAndUpdate(
      {"_id": projectId
      },
      {$set: body
      },
      {upsert: false, new: true},
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

function updateConnectS3 (projectId, connect) {
  console.log(projectId)
  return new Promise((resolve, reject) => {
    Project.findOneAndUpdate(
      {"_id": projectId},
      {$set: { connect: connect }},
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

function deleteMember (projectId, userId) {
  return new Promise((resolve, reject) => {
    Project.update({"_id": projectId},
      { "$pull": { "member": userId}},
      { safe: true, multi:true },
      function(err, obj) {
        if (err) {
          reject(err)
        } else {
          console.log(obj)
          let res = {}
          res.msg = `${userId} is successfully deleted`
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
exports.checkedProject = checkedProject
exports.getProjectByProjectId = getProjectByProjectId
exports.deleteProjectByProjectId = deleteProjectByProjectId
exports.getProjectsByUserId = getProjectsByUserId
exports.addMember = addMember
exports.deleteMember = deleteMember
exports.updateConnectS3 = updateConnectS3
