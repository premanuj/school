var express = require('express');
var router = express.Router();
var async = require('async');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var sendResponse = require('../routes/sendResponse');
var useFunction = require('../routes/useFunction');
var teachersModel = require('../models/teachersModel');
var dbConnection = require('../routes/dbConnection');

/*
*--------------------------------------------------------
*This api is used add profile details of the teacher
*--------------------------------------------------------
*/

router.post('/users/:user_id/teachers', function(req, res, next){
  // if (!req.session.teacher) {
  //     sendResponse.invalidAccessToken(res);
  //     return;
  // }
  var user_id = req.params.user_id;
  var fname = req.body.fname;
  var mname = req.body.mname;
  var lname = req.body.lname;
  var contacts = req.body.contacts;
  var address = req.body.address;
  var dob = req.body.dob;
  var join_date = req.body.join_date;
  var arrFields = [user_id, fname];

  async.waterfall([
    function(callback){
      useFunction.checkFields(res, arrFields, callback);
    }],
    function(error, result){
      if (!!error) {
        sendResponse.someThingWrongError(res);
      } else {
        var arrTeachers = [fname, mname, lname, contacts, address, dob, join_date, user_id];
        teachersModel.setTeachers(arrTeachers, function(result){
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
*This api is used to list all the available teachers
*--------------------------------------------------------
*/

router.get("/users/:user_id/teachers", function(req, res, next){
  var user_id = req.params.user_id;
  teachersModel.getTeacher(user_id, function(result){
    if (result===false) {
      var errorMsg = "Data selection Failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var data = [];
      result.forEach(function(value){
        data.push({'id':value['id'], 'fname':value['fname'], 'mname': value['mname'], 'lname':value['lname'], 'contacts':value['contacts'], 'address': value['address'], 'dob':value['dob'], 'join_date' : value['join_date'], 'user_id' : value['user_id']});
      });
      console.log(data);
      sendResponse.sendSuccessData(data, res);
    }
  });
});

/*
*--------------------------------------------------------
*This api is used update profile details of the teacher
*--------------------------------------------------------
*/

router.put("/users/:user_id/teachers/:t_id", function(req, res, next){
  var user_id = req.params.user_id;
  var t_id = req.params.t_id;
  var fname = req.body.fname;
  var mname = req.body.mname;
  var lname = req.body.lname;
  var contacts = req.body.contacts;
  var address = req.body.address;
  var dob = req.body.dob;
  var arrTeachers = [fname, mname, lname, contacts, address, dob, t_id];
  teachersModel.putTeacher(arrTeachers, function(result){
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

/*
*--------------------------------------------------------
*This api is used view subject of particular teacher
*--------------------------------------------------------
*/

router.get("/teachers/:teacher_id/subjects", function(req, res, next){
  var teacher_id = req.params.teacher_id;
  teachersModel.getSubjects(teacher_id, function(result){
    if (result===null) {
      var errorMsg = "No subject found for this teacher";
      sendResponse.sendErrorMessage(errorMsg, res);
    }else if(result===false){
    //  var errorMsg = "Subject selection failed.";
      sendResponse.someThingWrongError(res);
    }else {
      data = [];
      result.forEach(function(value){
        data.push({"id": teacher_id, "subject":value['name'], "grade": value['grade']});
      });
      sendResponse.sendSuccessData(data, res);
    }
  });
});

/*
*--------------------------------------------------------
*This api is used to post choose either the work is homework or exam
*--------------------------------------------------------
*/

router.post('/teachers/:teacher_id/subjects/:subject_id/works', function(req, res, next){
  var subject_id = req.params.subject_id;
  var work_title = req.body.work_title;
  var create_date = new Date();
  var submit_date = req.body.submit_date;
  var work_type = req.body.work_type;

  var arrWorks = [work_title, create_date, submit_date, work_type, subject_id];

  async.waterfall([
    function(callback){
      useFunction.checkFields(res, arrWorks, callback);
    }],
  function(error, result){
    if (!!error) {
      sendResponse.someThingWrongError(res);
    }else {
      teachersModel.setWorks(arrWorks, function(result){
        if (result===false) {
          var errorMsg = "Works insertation failed.";
          sendResponse.sendErrorMessage(errorMsg, res);
        } else {
          var data = {'id':result['insertId'], 'work_title': work_title, 'created_date':create_date, 'submit_date':submit_date, 'work_type':work_type, 'subject_id':subject_id};
          sendResponse.sendSuccessData(data, res);
        }
      });
    }
  });
});

router.get('/teachers/:teacher_id/subjects/:subject_id/works', function(req, res, next){
  var subject_id = req.params.subject_id;
  teachersModel.getWorks(subject_id, function(result){
    if(result===false){
      var errorMsg = "Work selection failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    }else {
      var data = [];
      result.forEach(function(value){
        data.push({'id': value['id'], 'work_title': value['work_title'], 'create_date': value['created_date'], 'submit_date':value['submit_date'], 'work_type': value['work_type'], 'subject_id': subject_id});
      });
      sendResponse.sendSuccessData(data, res);
    }
  });
});

router.put('/teachers/:teacher_id/subjects/:subject_id/works/:work_id', function(req, res, next){
  var work_id = req.params.work_id;
  var work_title = req.body.work_title;
  var work_type = req.body.work_type;
  var submit_date = req.body.submit_date;
  var arrWorks = [work_title, submit_date, work_type, work_id];
  teachersModel.updateWork(arrWorks, function(result){
    if (result===false) {
      var errorMsg = "Work updatin failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var successMsg = "Work updation Successfull.";
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});

router.delete('/teachers/:teacher_id/subjects/:subject_id/works/:work_id', function(req, res, next){
  var work_id = req.params.work_id;
  teachersModel.deleteWork(work_id, function(result){
    if(result===false){
      var errorMsg = "Work deletion failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    }else {
      var successMsg = "Work deletion successfull.";
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});

module.exports = router;
