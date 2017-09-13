var express = require('express');
var router = express.Router();
var db = require('../utils/db')
var Response = require('../utils/response');
var RESP = require('../utils/response_values');
var response = new Response();
var wiImage = require('../lib/image');
var wiUser = require('../lib/user');

router.get('/users/:userId/projects/:projectId', function(req, res) {
    var userId = req.params.userId;
    var projectId = req.params.projectId;

    console.log('userId =>' + userId);
    console.log('projectId =>' + projectId);

    if (userId == null ||
        userId == undefined) {

        res.status(400).send('userId is invalid');
    }
    if (projectId == null ||
        projectId == undefined) {

        res.status(400).send('projectId is invalid');
    }

    db.connectDB()
        .then( () => wiUser.getUserById(userId))
        .then( (dbUserProfile) => {
            console.log('dbUserId =>' + dbUserProfile._id);
            var dbUserId = dbUserProfile.id;

            if (dbUserId != userId) {
                res.status(401).send('userId is incorrect')
            } else {
                db.connectDB()
                    .then( () => wiImage.getImagesByProjectId(projectId))
                    .then( (images) => {
                        response.responseStatus = RESP.SUCCESS
                        response.responseMessage = RESP.SUCCESS
                        response.data = {
                            Images: images
                        }
                        res.json(response)
                    }).catch( function (error) {
                    console.error(error)
                    response.responseStatus = RESP.FAIL;
                    response.responseMessage = error;
                    res.json(response)
                })
            }
        })
});

router.post('/', function (req, res) {
  db.connectDB()
    .then( () => wiImage.setImages(req.body))
    //.then( () => wiImage.updateUsermarkingCount(req.body.userId))
    .then( (result) => {
      response.responseStatus = RESP.SUCCESS
      response.responseMessage = "Successfully Save"
      response.data = result
      res.json(response)
    }).catch( function (error) {
    console.error(error)
    response.responseStatus = RESP.FAIL;
    response.responseMessage = error;
    res.json(response)
  })
})

module.exports = router;
