var express = require('express');
var router = express.Router();
var async = require('async');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var sendResponse = require('../routes/sendResponse');
var useFunction = require('../routes/useFunction');
var accountsModels = require('../models/studentssModel');
var dbConnection = require('../routes/dbConnection');

router.put('/users/:user_id', function(req, res, next){
  var user_id = req.params.user_id;
  var fname = req.body.fname;
  var mname = req.body.mname;
  var lname = req.body.lname;
  var dob = req.body.dob;
  var join_date = req.body.join_date;
  

});
