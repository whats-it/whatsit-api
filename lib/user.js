var config = require('../config.json')
var User = require('../models/user');

function createUser (data) {
  return new Promise((resolve, reject) => {
    console.log(data)
    User.findOneAndUpdate(
      {"login": data.login,
        "oauthProvider": data.oauthProvider
      },
      {$set:{
        'login': data.login,
        'avatarUrl': data.avatarUrl,
        'email': data.email ? data.email : null,
        'oauthProvider': data.oauthProvider,
        'oauthUserId': data.oauthUserId
      },
      },
      {upsert: true, new: true},
      function(err, user) {
        if (err) {
          console.error(err)
          reject(err)
        }
        console.log('createUser done: ' + user._id)
        resolve(user)
      }
    )
  })
}

function getUserById (id) {
  return new Promise((resolve, reject) => {
    User.findOne(
      {"_id": id},
      function(err, user) {
        if (err) {
          console.error(err)
          reject(err)
        }
        console.log('getUserById done: ' + user)
        resolve(user)
      }
    )
  })
}

exports.createUser = createUser
exports.getUserById = getUserById
