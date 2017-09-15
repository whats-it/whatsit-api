var express = require('express');
var router = express.Router();
var db = require('../utils/db')
var Response = require('../utils/response');
var RESP = require('../utils/response_values');
var response = new Response();
var wiDataset = require('../lib/dataset');
var AwPubSub = require('whatsit-pubsub')

router.get('/', function(req, res) {
  var projectId = req.query.projectId;
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

router.get('/:datasetId', function(req, res) {
  var datasetId = req.params.datasetId;
  var projectId = req.query.projectId;
  console.log('datasetId =>' + datasetId);
  console.log('projectId =>' + projectId);

  if (datasetId == null ||
    datasetId == undefined) {

    res.status(400).send('datasetId is invalid');
  }

  db.connectDB()
    .then( () => wiDataset.getDatasetByDatasetId(datasetId))
    .then( (dataset) => {
      response.responseStatus = RESP.SUCCESS
      response.responseMessage = RESP.SUCCESS
      response.data = dataset;
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

      let awPubSub = new AwPubSub()
      console.log('publish :whatsit/index/video');
      awPubSub.nrp.emit('whatsit/index/video', JSON.stringify(result));

      res.json(response)
    }).catch( function (error) {
    console.error(error)
    response.responseStatus = RESP.FAIL;
    response.responseMessage = error;
    res.json(response)
  })
})

router.put('/:datasetId', function (req, res) {
  var datasetId = req.params.datasetId;

  if (datasetId == null ||
    datasetId == undefined) {

    res.status(400).send('datasetId is invalid');
  }

  db.connectDB()
    .then( () => wiDataset.updateDatasetByDatasetId(datasetId, req.body))
    .then( (result) => {
      response.responseStatus = RESP.SUCCESS
      response.responseMessage = RESP.SUCCESS
      response.data = result;
      res.json(response)
    }).catch( function (error) {
    console.error(error)
    response.responseStatus = RESP.FAIL;
    response.responseMessage = error;
    res.json(response)
  })
})

module.exports = router;
