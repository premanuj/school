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
  console.log(arrFields);

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


router.put('/users/:user_id/teachers/:teacher_id', function(req, res, next){
  // if (!req.session.teacher) {
  //     sendResponse.invalidAccessToken(res);
  //     return;
  // }
  var user_id = req.params.user_id;
  var teacher_id = req.params.user_id;
  var fname = req.body.fname;
  var mname = req.body.mname;
  var lname = req.body.lname;
  var contacts = req.body.contacts;
  var address = req.body.address;
  var dob = req.body.dob;
  var join_date = req.body.join_date;
  var arrFields = [user_id, teacher_id, fname];
  console.log(arrFields);

  async.waterfall([
    function(callback){
      useFunction.checkFields(res, arrFields, callback);
    }],
    function(error, result){
      if (!!error) {
        sendResponse.someThingWrongError(res);
      } else {
        var arrTeachers = [fname, mname, lname, contacts, address, dob, join_date, teacher_id];
        teachersModel.updateTeachers(arrTeachers, function(result){
          if (result===false) {
            var errorMsg = "Data Insertation Failed";
            sendResponse.sendErrorMessage(errorMsg, res);
          }else {
            var successMsg = "Updated successfully"
            //var data = {'id':result['insertId'], 'fname':fname, 'mname':mname, 'lname':lname, 'contacts':contacts, 'address':address, 'dob':dob, 'join_date':join_date, 'user_id':user_id};
            sendResponse.successStatusMsg(successMsg, res);
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

router.get("/roles/:role_id/teachers", function(req, res, next){
  var role_id = req.params.role_id;
  teachersModel.getTeacher(role_id, function(result){
    if (result===false) {
      var errorMsg = "Data selection Failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var data = [];
      result.forEach(function(value){
        //console.log(value);
        data.push({'id':value['id'], 'fname':value['fname'], 'mname': value['mname'], 'lname':value['lname'], 'email':value['email'], 'contacts':value['contacts'], 'address': value['address'], 'dob':value['dob'], 'join_date' : value['join_date'], 'user_id' : value['user_id']});
      });
      sendResponse.sendSuccessData(data, res);
    }
  });
});

/*
*--------------------------------------------------------
*This api is used to list of get all the available teachers
*--------------------------------------------------------
*/

router.get("/teachers", function(req, res, next){
  var role_id = req.params.role_id;
  teachersModel.getAllTeacher(role_id, function(result){
    if (result===false) {
      var errorMsg = "Data selection Failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var data = [];
      result.forEach(function(value){
        //console.log(value);
        data.push({'id':value['id'], 'fname':value['fname'], 'mname': value['mname'], 'lname':value['lname'], 'contacts':value['contacts'], 'address': value['address'], 'dob':value['dob'], 'join_date' : value['join_date'], 'user_id' : value['user_id']});
      });
      sendResponse.sendSuccessData(data, res);
    }
  });
});

/*
*--------------------------------------------------------
*This api is used to list all the available teachers by user id
*--------------------------------------------------------
*/

router.get("/roles/:role_id/users/:user_id/teachers", function(req, res, next){
  var role_id = req.params.role_id;
  var user_id = req.params.user_id;
  var arrTeachers = [role_id, user_id];
  teachersModel.getTeacherById(arrTeachers, function(result){
    if (result===false) {
      var errorMsg = "Data selection Failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var data = [];
      result.forEach(function(value){
        //console.log(value);
        data.push({'id':value['id'], 'fname':value['fname'], 'mname': value['mname'], 'lname':value['lname'], 'email':value['email'], 'contacts':value['contacts'], 'address': value['address'], 'dob':value['dob'], 'join_date' : value['join_date'], 'user_id' : value['user_id']});
      });
      sendResponse.sendSuccessData(data, res);
    }
  });
});

/*
*--------------------------------------------------------
*This api is used update profile details of the teacher
*--------------------------------------------------------
*/

router.put("/roles/:role_id/teachers/:t_id", function(req, res, next){
  var user_id = req.params.role_id;
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

router.delete('/roles/:role_id/users/:user_id/teachers/:teacher_id', function(req, res, next){
  console.log('here');
  var teacher_id = req.params.user_id;
  // var teacher_id = req.params.teacher_id;
  console.log(teacher_id);
  teachersModel.deleteTeachers(teacher_id, function(result){
    if (result===false) {
      console.log('errrrrr');
      var errorMsg = "Teachers cannot deleted.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var successMsg = "Techers deleted successfully";
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
  console.log(teacher_id);
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
        data.push({"teacher_id": teacher_id, "id": value['id'], "subject":value['name'], "grade": value['grade'], "class_id": value['class_id']});
      });
      console.log(data);
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
  console.log(arrWorks);
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

router.post('/teachers/:teacher_id/subjects/:subject_id/works/:work_id/questions', function(req, res, next){
  var work_id = req.params.work_id;
  var subjective = req.body.subjective;
  var objective = req.body.objective;
  var arrSubjective = [subjective, work_id];
  var arrObjective = [objective, work_id];
  // console.log(arrSubjective);
  // console.log(arrObjective);
  async.parallel([
    function(callback){
      if (subjective.length!=0) {
        teachersModel.setSubjectiveQuestions(arrSubjective, function(result){
          callback(null);
        });
      }
    },
    function(callback){
      if (objective.length!=0) {
        teachersModel.setObjectiveQuestions(arrObjective, function(result){
          callback(null);
        });
      }else {
        console.log('no oobjective');
        callback(null);
      }
    }
  ],
  function(error, result){
    if (!!error) {
      console.log(error);
      sendResponse.someThingWrongError(res);
    }else {
      var successMsg = "Questions posted successfully.";
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});

router.get('/teachers/:teacher_id/subjects/:subject_id/works/:work_id/questions', function(req, res, next){
  var work_id = req.params.work_id;
  teachersModel.getQuestions(work_id, function(result){
    if(result===false){
      sendResponse.someThingWrongError(res);
    }else {
     sendResponse.sendSuccessData(result, res);
    }
  });
});

router.put('/teachers/:teacher_id/subjects/:subject_id/works/:work_id/questions/:question_id', function(req, res, next){
  var work_id = req.params.work_id;
  var question_id = req.params.question_id;
  var question_title = req.body.question_title;
  var weightage_marks = req.body.weightage_marks;
  if(req.body.options){
    var options = req.body.options;
    var arrUpdate = [question_title, weightage_marks, question_id, options];
  }else {
    var arrUpdate = [question_title, weightage_marks, question_id];
  }
  teachersModel.updateQuestions(arrUpdate, function(result){
    if(result===false){
      sendResponse.someThingWrongError(res);
    }else {
      var successMsg = "Updated successfully"
     sendResponse.successStatusMsg(successMsg, res);
    }
  });
});

router.delete('/teachers/:teacher_id/subjects/:subject_id/works/:work_id/questions/:question_id', function(req, res, next){
  var question_id = req.params.question_id;
  var work_id = req.params.work_id;
  var question_type = req.body.question_type;
  var arrQuestion = [question_id, question_type];

  teachersModel.deleteQuestion(arrQuestion, function(result){
      if (result===false) {
        var errorMsg = "Deletion failed. Database Error.";
        sendResponse.sendErrorMessage(errorMsg, res);
      }else {
        var successMsg = "Deletion Successfull.";
        sendResponse.successStatusMsg(successMsg, res);
      }
  });
});

router.get('/teachers/:teacher_id/subjects/:subject_id/works/:work_id/studentanswers', function(req, res, next){
  teachersModel.getStudentanswers(function(result){
    if (result===false) {
      var errorMsg = "Selection of answer posted by student failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    }else {
      sendResponse.sendSuccessData(result, res);
    }
  });
});

//update studentanswers table and give marks for subjective questions by teachers.

router.put('/teachers/:teacher_id/subjects/:subject_id/works/:work_id/questions/:q_id/studentanswers/:std_id', function(req, res, next){
  var std_id = req.params.std_id;
  var q_id = req.params.q_id;
  var weightage_marks = req.body.weightage_marks;
  var arrMarks = [weightage_marks, std_id, q_id];
  teachersModel.putMarks(arrMarks, function(result){
    if (result===false) {
      var errorMsg = "Marks updation failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var successMsg = "Marks updated successfully.";
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});

router.post('/teachers/:teacher_id/subjects/:subject_id/works/:work_id/students/:student_id/results', function(req, res, next){
  var work_id = req.params.work_id;
  var std_id = req.params.student_id;
  //var feedback = req.body.feedback;
  var arrResult = [std_id, work_id];
  teachersModel.setResults(arrResult, function(result){
    if (result===false) {
      var errorMsg = "Result post failed. It seems result has been posted already for corresponding student and work.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var successMsg = "Result posted successfully.";
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});

//get all results by work_id
//NOT COMPLETED

router.get('/teachers/:teacher_id/subjects/:subject_id/works/:work_id/students/:student_id/results', function(req, res, next){
  var work_id = req.params.work_id;
  var subject_id = req.params.subject_id;
  var student_id = req.params.student_id;
  var arrInfo = [work_id, student_id];
  console.log(work_id);
  teachersModel.getResultsByWorkId(arrInfo, function(result){
    if(result===false){
      var errorMsg = "Result selection failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
      console.error(error);
    }else {
      sendResponse.sendSuccessData(result, res);
    }
  });

});


//get all results of particular subject
//NOT COMPLETED

// router.get('/teachers/:teacher_id/subjects/:subject_id/works/:work_id/results', function(res, req, next){
//   if(req.params.work_id){
//     console.log('seted');
//   }
//   console.log('here');
//   var work_id = req.params.work_id;
//   console.log(work_id);
//   teachersModel.getResultsByWorkId(work_id, function(result){
//     if(result===false){
//       var errorMsg = "Result selection failed.";
//       sendResponse.sendErrorMessage(errorMsg, res);
//       console.error(error);
//     }else {
//       sendResponse.sendSuccessData(result, res);
//     }
//   });
// });


// router.get('/teachers/:teacher_id/subjects/:subject_id/works/:work_id/students/:student_id/results', function(res, req, next){
//   var work_id = req.params.work_id;
//   var std_id = req.params.student_id;
//
// });

router.put('/teachers/:teacher_id/subjects/:subject_id/works/:work_id/students/:student_id/results/feedback', function(req, res, next){
  var work_id = req.params.work_id;
  var std_id = req.params.student_id;
  var feedback = req.body.feedback;
  var arrResult = [feedback, std_id, work_id];
  teachersModel.putResults(arrResult, function(result){
    if (result===false) {
      var errorMsg = "Feedback updation failed.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var successMsg = "Feedback posted successfully";
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});

module.exports = router;
