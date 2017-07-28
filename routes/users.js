var express = require('express')
var router = express.Router();
var db = require('../utils/db')
var Response = require('../utils/response');
var RESP = require('../utils/response_values');
var response = new Response();
var wiUser = require('../lib/user')

router.post('/', function(req, res){
    db.connectDB()
    .then( () => wiUser.createUser(req.body))
    .then( user => {
      response.responseStatus = RESP.SUCCESS;
      response.responseMessage = RESP.SUCCESS
      response.data = user
      res.json(response)
    }).catch( function (error) {
      console.error(error)
      response.responseStatus = RESP.FAIL;
      response.responseMessage = error;
      res.json(response)
    })
});

router.get('/:userId', function(req, res){
  db.connectDB()
  .then( () => wiUser.getUserById(req.params.userId))
  .then( user => {
    response.responseStatus = RESP.SUCCESS;
    response.responseMessage = RESP.SUCCESS
    response.data = user
    res.json(response)
  }).catch( function (error) {
    console.error(error)
    response.responseStatus = RESP.FAIL;
    response.responseMessage = error;
    res.json(response)
  })
});

module.exports = router;
