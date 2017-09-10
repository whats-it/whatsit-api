var express = require('express');
var router = express.Router();
var db = require('../utils/db')
var Response = require('../utils/response');
var RESP = require('../utils/response_values');
var response = new Response();
var wiDataset = require('../lib/dataset');

router.get('/projects/:projectId', function(req, res) {
  var projectId = req.params.projectId;
  console.log('projectId =>' + projectId);

  if (projectId == null ||
    projectId == undefined) {

    res.status(400).send('projectId is invalid');
  }

  db.connectDB()
    .then( () => wiDataset.getDatasetsByProjectId(projectId))
    .then( (datasets) => {
      response.responseStatus = RESP.SUCCESS
      response.responseMessage = RESP.SUCCESS
      response.data = {
        Datasets: datasets
      }
      res.json(response)
    }).catch( function (error) {
    console.error(error)
    response.responseStatus = RESP.FAIL;
    response.responseMessage = error;
    res.json(response)
  })
});

router.post('/', function (req, res) {
  db.connectDB()
    .then( () => wiDataset.addDataset(req.body))
    .then( (result) => {
      response.responseStatus = RESP.SUCCESS
      response.responseMessage = "Successfully Saved"
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
