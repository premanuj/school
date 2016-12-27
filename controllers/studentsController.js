var express = require('express');
var router = express.Router();
var async = require('async');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var sendResponse = require('../routes/sendResponse');
var useFunction = require('../routes/useFunction');
var studentsModel = require('../models/studentsModel');
var dbConnection = require('../routes/dbConnection');

router.post('/users/:user_id/students', function(req, res, next){
  // if (!req.session.student) {
  //     sendResponse.invalidAccessToken(res);
  //     return;
  // }
  var user_id = req.params.user_id;
  var fname = req.body.fname;
  var mname = req.body.mname;
  var lname = req.body.lname;
  var dob = req.body.dob;
  var join_date = req.body.join_date;
  var address = req.body.address;
  var contacts = req.body.contacts;
  var class_id = req.body.class_id;
  var arrFields = [user_id, class_id, fname, dob, join_date];

  async.waterfall([
    function(callback){
      useFunction.checkFields(res, arrFields, callback);
    }],
    function(error, result){
      if (!!error) {
        sendResponse.someThingWrongError(res);
      } else {
        var arrStudents = [fname, mname, lname, dob, join_date, address, contacts, class_id, user_id];
        studentsModel.setStudents(arrStudents, function(result){
          if (result===false) {
            var errorMsg = "Data Insertation Failed";
            sendResponse.sendErrorMessage(errorMsg, res);
          }else {
            console.log(result);
            var data = {'id':result['insertId'], 'fname':fname, 'mname':mname, 'lname':lname, 'contacts':contacts, 'address':address, 'dob':dob, 'join_date':join_date, 'user_id':user_id};
            sendResponse.sendSuccessData(data, res);
          }
        });
      }
    });
});

/*
*--------------------------------------------------------
*This api is used to list all the available students
*--------------------------------------------------------
*/

router.get("/users/:user_id/students", function(req, res, next){
  var user_id = req.params.user_id;
  studentsModel.getStudents(user_id, function(result){
    if (result===false) {
      var errorMsg = "Data selection Failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var data = [];
      result.forEach(function(value){
        data.push({'id':value['id'], 'fname':value['fname'], 'mname': value['mname'], 'lname':value['lname'], 'contact':value['contact'], 'address': value['address'], 'dob':value['dob'], 'join_date' : value['join_date'], 'class_id':value['class_id'], 'user_id' : value['user_id']});
      });
      console.log(data);
      sendResponse.sendSuccessData(data, res);
    }
  });
});

/*
*--------------------------------------------------------
*This api is used update profile details of the student
*--------------------------------------------------------
*/

router.put("/users/:user_id/students/:s_id", function(req, res, next){
  var user_id = req.params.user_id;
  var s_id = req.params.s_id;
  var fname = req.body.fname;
  var mname = req.body.mname;
  var lname = req.body.lname;
  var contacts = req.body.contacts;
  var address = req.body.address;
  var dob = req.body.dob;
  var class_id = req.body.class_id;
  var arrStudents = [fname, mname, lname, contacts, address, dob, s_id];
  studentsModel.putStudent(arrStudents, function(result){
    if (result===false) {
      var errorMsg = "Data updation Failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
    //  var data = {'id':result[0]['id'], 'fname':result[0]['fname'], 'mname': result[0]['mname'], 'lname':result[0]['lname'], 'contacts':result[0]['contacts'], 'address': result[0]['address'], 'dob':result[0]['dob'], 'join_date' : result[0]['join_date'], 'user_id' : result[0]['user_id']};
      var successMsg = "Updation Successfull.";
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});

router.post("/users/:user_id/students/:s_id/answers", function(req, res, next){
  var user_id = req.params.user_id;
  var s_id = req.params.s_id;
  var q_id = req.body.q_id;
  var answer = req.body.answer;
  var arrAnswer = [q_id, answer, s_id];
  studentsModel.setAnswers(arrAnswer, function(result){
    if (result===false) {
      var errorMsg = "Answer Submission Faild.";
      sendResponse.sendErrorMessage(errorMsg, res);
    }else {
      var successMsg = "Answer submission successfully."
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});

module.exports = router;
