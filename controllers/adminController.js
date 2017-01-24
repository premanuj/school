var express = require('express');
var router = express.Router();
var async = require('async');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var sendResponse = require('../routes/sendResponse');
var useFunction = require('../routes/useFunction');
var adminModel = require('../models/adminModel');
var dbConnection = require('../routes/dbConnection');

// router.post('users/:user_id/admin/teachers', function(res, req, next){
//   var email = req.body.email;
//   var username = req.body.username;
//   var password = req.body.password;
//   var fname = req.body.fname;
//   var mname = req.body.mname;
//   var lname = req.body.lname;
//   var contact = req.body.contact;
//   var address = req.body.address;
//
// });

router.post('/classes/:class_id/sections', function(req, res, next){
  var class_id = req.params.class_id;
  var section = req.body.section;
  var arrSection = [section, class_id];
  console.log(arrSection);
  // if (!req.session.admin) {
  //   console.log(req.session.admin);
  //   sendResponse.invalidAccessToken(res);
  //   return;
  // }
  adminModel.setSections(arrSection, function(result){
    if (result===false) {
      var errorMsg = "Section insertation failed";
      sendResponse.sendErrorMessage(errorMsg, res);
    }else{
      //var successMsg = "Section inserted successfully.";
      var data = {'id':result['insertId'], 'name': section};
      console.log(data);
      console.log(result);
      sendResponse.sendSuccessData(data, res);
    }
  });
});

router.get('/classes/:class_id/sections', function(req,res, next){
  // if (!req.session.admin) {
  //   console.log('no session for admin');
  //   sendResponse.invalidAccessToken(res);
  //   return;
  // }
  var class_id = req.params.class_id;
  adminModel.getSectionsByClassID(class_id, function(result){
    if (result===false) {
      var errorMsg = "Section selection failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var data = [];
      result.forEach(function(value){
        data.push({'id': value['id'], 'section': value['name']});
      });
      sendResponse.sendSuccessData(data, res);
    }
  });
});

router.get('/classes/sections', function(req,res, next){
  // if (!req.session.admin) {
  //   console.log('no session for admin');
  //   sendResponse.invalidAccessToken(res);
  //   return;
  // }
  adminModel.getSections(function(result){
    if (result===false) {
      var errorMsg = "Section selection failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var data = [];
      result.forEach(function(value){
        data.push({'id': value['id'], 'section': value['name'], 'class_id':value['class_id']});
      });
      sendResponse.sendSuccessData(data, res);
    }
  });
});


router.put('/classes:class_id/sections/:section_id', function(req, res, next){
  var section_id = req.params.section_id;
  var class_id = req.params.class_id;
  var section = req.body.section;
  var arrSection = [section, section_id, class_id];
  console.log(arrSection);
  // if (!req.session.admin) {
  //   console.log('no session for admin');
  //   sendResponse.invalidAccessToken(res);
  //   return;
  // }
  adminModel.putSection(arrSection, function(result){
    if (result===false) {
      var errorMsg = "Section updation failed. Check your section id";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var successMsg = "Section updated successfully.";
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});


router.delete('/classes/:class_id/sections/:section_id', function(req, res, next){
  var section_id = req.params.section_id;
  var class_id = req.params.class_id;
  var arrSection = [section_id, class_id];
  // if (!req.session.admin) {
  //   console.log('no session for admin');
  //   sendResponse.invalidAccessToken(res);
  //   return;
  // }
  adminModel.deleteSection(arrSection, function(result){
    if (result===false) {
      var errorMsg = "Section deletion failed. Check your section id";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var successMsg = "Section deleted successfully.";
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});

router.post('/classes', function(req, res, next){
  var grade = req.body.grade;
  // if (!req.session.admin) {
  //   console.log('you are not admin. please log in as admin.');
  //   sendResponse.invalidAccessToken(res);
  //   return;
  // }
  async.waterfall([
    function(callback){
      useFunction.checkFields(res, grade, callback);
    }],
  function(error, result){
    if (!!error) {
      console.error(error);
      sendResponse.someThingWrongError(res);
    }else {
      adminModel.setClasses(grade, function(result){
        if (result===false) {
          var errorMsg = "Classes insertation failed";
          sendResponse.sendErrorMessage(errorMsg, res);
        }else{
          var successMsg = "Classes inserted successfully.";
          console.log(successMsg);
          var data = {'id':result['id'], 'grade': result['grade']}
          sendResponse.sendSuccessData(data, res);
        }
      });
    }
  });
});

router.get('/classes', function(req,res, next){
  console.log('hereeeeee');
  // if (!req.session.admin) {
  //   console.log('no session for admin');
  //   sendResponse.invalidAccessToken(res);
  //   return;
  // }
  adminModel.getclasses(function(result){
    if (result===false) {
      var errorMsg = "Classes selection failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var data = [];
      result.forEach(function(value){
        data.push({'id': value['id'], 'grade': value['grade']});
      });
      sendResponse.sendSuccessData(data, res);
    }
  });
});

router.put('/classes/:class_id', function(req, res, next){
  var class_id = req.params.class_id;
  var grade = req.body.grade;
  var arrGrade = [grade, class_id];
  // if (!req.session.admin) {
  //   console.log('no session for admin');
  //   sendResponse.invalidAccessToken(res);
  //   return;
  // }
  adminModel.putClass(arrGrade, function(result){
    if (result===false) {
      var errorMsg = "Class updation failed. Check your class id";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var successMsg = "Class updated successfully.";
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});


router.delete('/classes/:class_id', function(req, res, next){
  var class_id = req.params.class_id;
  console.log(class_id);
  // if (!req.session.admin) {
  //   console.log('no session for admin');
  //   sendResponse.invalidAccessToken(res);
  //   return;
  // }
  adminModel.deleteClass(class_id, function(result){
    if (result===false) {
      var errorMsg = "Class deletion failed. Check your class id";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var successMsg = "Class deleted successfully.";
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});


router.post('/classes/:class_id/subjects', function(req, res, next){
  var class_id = req.params.class_id;
  var subject = req.body.subject;
  var teacher_id = req.body.teacher_id;
  var arrSubjects = [subject, class_id, teacher_id];
  // if (!req.session.admin) {
  //   console.log('you are not admin. please log in as admin.');
  //   sendResponse.invalidAccessToken(res);
  //   return;
  // }
  async.waterfall([
    function(callback){
      useFunction.checkFields(res, arrSubjects, callback);
    }],
  function(error, result){
    if (!!error) {
      console.error(error);
      sendResponse.someThingWrongError(res);
    }else {
      adminModel.setSubjects(arrSubjects, function(result){
        if (result===false) {
          var errorMsg = "Subject insertation failed";
          sendResponse.sendErrorMessage(errorMsg, res);
        }else{
          //var successMsg = "Classes inserted successfully.";
          var data = {'id':result['id'], 'class_id': class_id, 'teacher_id': teacher_id}
          sendResponse.sendSuccessData(data, res);
        }
      });
    }
  });
});

router.get('/classes/:class_id/subjects', function(req,res, next){
  console.log('hereeeeee');
  var class_id = req.params.class_id;
  // if (!req.session.admin) {
  //   console.log('no session for admin');
  //   sendResponse.invalidAccessToken(res);
  //   return;
  // }
  adminModel.getSubjectsByClassId(class_id, function(result){
    if (result===false) {
      var errorMsg = "Subjects selection failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var data = [];
      result.forEach(function(value){
        data.push({'id': value['id'], 'class_id': value['class_id'], 'subject':value['name'], 'teacher_id':value['teacher_id']});
      });
      sendResponse.sendSuccessData(data, res);
    }
  });
});

router.get('/classes/subjects', function(req,res, next){
  console.log('hereeeeee');
  // if (!req.session.admin) {
  //   console.log('no session for admin');
  //   sendResponse.invalidAccessToken(res);
  //   return;
  // }
  adminModel.getSubjects(function(result){
    if (result===false) {
      var errorMsg = "Subjects selection failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var data = [];
      result.forEach(function(value){
        data.push({'id': value['id'], 'class_id': value['class_id'], 'subject':value['name'], 'teacher_id':value['teacher_id']});
      });
      sendResponse.sendSuccessData(data, res);
    }
  });
});

router.put('/classes/:class_id/subjects/:subject_id', function(req, res, next){
  var subject_id = req.params.subject_id;
  var subject = req.body.subject;
  var teacher_id = req.body.teacher_id;
  var class_id = req.params.class_id;

  var arrSubjects = [subject, class_id, teacher_id, subject_id];
  console.log(arrSubjects);
  // if (!req.session.admin) {
  //   console.log('no session for admin');
  //   sendResponse.invalidAccessToken(res);
  //   return;
  // }
  adminModel.putSubject(arrSubjects, function(result){
    if (result===false) {
      var errorMsg = "Subject updation failed. Check your subject id";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var successMsg = "Subject updated successfully.";
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});


router.delete('/classes/:class_id/subjects/:subject_id', function(req, res, next){
  var subject_id = req.params.subject_id;
  // if (!req.session.admin) {
  //   console.log('no session for admin');
  //   sendResponse.invalidAccessToken(res);
  //   return;
  // }
  console.log(subject_id);
  adminModel.deleteSubject(subject_id, function(result){
    if (result===false) {
      var errorMsg = "Subject deletion failed. Check your subject id";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var successMsg = "Subject deleted successfully.";
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});
module.exports = router;
