var connection = require("../routes/dbConnection.js");
var async = require('async');

module.exports.setStudents = function(arrStudents, callback) {
    var sql_setStudents = "INSERT INTO students (fname, mname, lname, dob, join_date, address, contact, class_id, user_id) VALUES (?, ?, ?, ?, ?, ?,? ,? ,?)";
    connection.query(sql_setStudents, arrStudents, function(error, result) {
        if (!!error) {
            console.error(error);
            callback(false);
          } else {

            callback(result);
        }
    });
}

module.exports.getStudents = function(role_id, callback) {
    var sql_getStudents = "SELECT s.id, u.email, u.access_token, u.status, s.fname, s.mname, s.lname, s.dob, s.join_date, s.address, s.contact, s.class_id, s.user_id, c.grade FROM users u INNER JOIN students s ON u.id = s.user_id INNER JOIN classes c ON s.class_id = c.id WHERE u.role_id = ? and s.user_id = ?";
    connection.query(sql_getStudents, role_id, function(error, resultRows, fields) {
        if (!!error) {
            console.error(error);
            callback(false);
        } else {
            callback(resultRows);
        }
    });
};


module.exports.getStudentsByClass = function(role_id, callback) {
    var sql_getStudents = "SELECT s.id, u.email, u.access_token, u.status, s.fname, s.mname, s.lname, s.dob, s.join_date, s.address, s.contact, s.class_id, s.user_id, c.grade FROM users u INNER JOIN students s ON u.id = s.user_id INNER JOIN classes c ON s.class_id = c.id WHERE u.role_id = ? and s.class_id = ?";
    connection.query(sql_getStudents, role_id, function(error, resultRows, fields) {
        if (!!error) {
            console.error(error);
            callback(false);
        } else {
            callback(resultRows);
        }
    });
};

module.exports.putStudent = function(arrStudents, callback) {
    var sql_putStudents = "UPDATE students SET fname = ?, mname = ?, lname = ?, contact = ?, address = ?, dob = ?, join_date = ?, class_id = ? WHERE id = ?";
    connection.query(sql_putStudents, arrStudents, function(error, result) {
        if (!!error) {
          console.error("eeeeeeeeeee");
            console.error(error);
            callback(false);
        } else {
          console.log("sssssssssss");
            callback(result);
        }
    });
}

module.exports.deleteStudents = function(deleteStudents, callback){
  var sql_deleteStudents = "DELETE FROM students WHERE id = ?";
  connection.query(sql_deleteStudents, deleteStudents, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    } else {
      console.log('student deletion success');
      callback(true);
    }
  });
}

module.exports.setAnswers = function(arrAnswers, callback) {
  console.log(arrAnswers);
    var q_id = arrAnswers[0];
    var answers = arrAnswers[1];
    console.log(answers);
    var s_id = arrAnswers[2];
    var sql_getQuestions = "SELECT * FROM questions WHERE id = ?";
    var sql_setMarks = "INSERT INTO studentanswers (std_id, question_id, answer, weightage_marks) VALUES (?, ?, ?, ?)";
    var answerMarks = [];
    var count = 0;
    async.eachSeries(q_id, function(singleQuestion, questionCallback) {
            connection.query(sql_getQuestions, singleQuestion, function(error, questionRows, fields) {
                if (!!error) {
                    console.error(error);
                    callback(false);
                } else {
                  //  if (questionRows[0].option_id == answers[count] && questionRows[0].question_type === 'o') {
                    if (questionRows[0].question_type === 'o') {
                      if(questionRows[0].option_id==answers[count]){
                        answerMarks.push(questionRows[0].weightage_marks);
                        count = parseInt(count)+1;
                        questionCallback();
                      }else {
                        answerMarks.push(0);
                        count = parseInt(count)+1;
                        questionCallback();
                      }
                    } else {
                        answerMarks.push(null);
                        count = parseInt(count)+1;
                        questionCallback();
                    }
                }
            });
        },
        function(error) {
            if (!!error) {
                callback(false);
            } else {
                count = 0;
                async.eachSeries(answers, function(singleAnswer, answerCallback) {
                    var arrMarks = [s_id, q_id[count], singleAnswer, answerMarks[count]];
                    connection.query(sql_setMarks, arrMarks, function(error, resultRows) {
                        if (!!error) {
                            console.error(error);
                            callback(false);
                        } else {
                            count = parseInt(count)+1;
                            console.log(count);
                            answerCallback();
                        }
                    });
                },
              function(error){
                if (!!error) {
                  console.error(error);
                  callback(false);
                } else {
                  console.log('here');
                  callback(true);
                }
              });
            }
        });
}

module.exports.getWorks = function(class_id, callback) {
    var sql_getWorks = "SELECT sub.name, w.work_title, w.submit_date, w.work_type, w.id FROM subjects sub INNER JOIN works w ON sub.id = w.subject_id WHERE sub.class_id = ?";
    connection.query(sql_getWorks, class_id, function(error, resultRows, fields) {
        if (!!error) {
            console.error(error);
            callback(false);
        } else {
            callback(resultRows);
        }
    });
};

module.exports.getQuestions = function(work_id, callback) {
    var sql_getQuestion = "SELECT id, question_title, question_type, weightage_marks, option_id FROM questions WHERE work_id = ? ";
    var sql_getOptions = "SELECT * FROM options WHERE question_id = ?";
    var data = [];
    var option = [];
    connection.query(sql_getQuestion, work_id, function(error, resultQuestion) {
        if (!!error) {
            callback(false);
        } else {
            var q_id = resultQuestion['id'];
            var id = [];
            async.eachSeries(resultQuestion, function(question, questionCallback) {
                    if (question['question_type'] === 'o') {
                        id.push(question['id']);
                    }
                    questionCallback();
                },
                function(error) {
                    if (!!error) {
                        callback(false);
                    } else {
                        async.eachSeries(id, function(getId, optionCallback) {
                                connection.query(sql_getOptions, getId, function(error, optionResult) {
                                    if (!!error) {
                                        callback(false);
                                    } else {
                                        option.push(optionResult);
                                        optionCallback();
                                    }
                                });
                            },
                            function(error) {
                                if (!!error) {
                                    console.log('eeeeee');
                                    console.error(error);
                                    callback(false);
                                } else {
                                    data = {
                                        'question': resultQuestion,
                                        'option': option
                                    };
                                    callback(data);
                                }
                            });
                    }
                });
        }
    });
}

module.exports.getAnswers = function(student_id, callback){
  var sql_getAnswers = "SELECT * FROM studentanswers WHERE std_id = ?";
  connection.query(sql_getAnswers, student_id, function(error, resultAnswers){
    if(!!error){
      console.log(error);
      callback(false);
    }else {
      console.log(resultAnswers);
      callback(resultAnswers);
    }
  });
}


module.exports.getResults = function(work_id, callback) {
    var sql_getREsults = "SELECT * FROM results WHERE work_id = ? AND std_id = ?";
    connection.query(sql_getREsults, work_id, function(error, resultRows) {
        if (!!error) {
            console.error(error);
            callback(false);
        } else {
            callback(resultRows);
        }
    });
}


module.exports.checkWorks = function(s_id, callback) {
    var sql_checkWorks = "SELECT DISTINCT q.work_id FROM studentanswers s INNER JOIN questions q ON s.question_id = q.id WHERE s.std_id = ?";
    connection.query(sql_checkWorks, s_id, function(error, resultRows) {
        if (!!error) {
            console.error(error);
            callback(false);
        } else {
            callback(resultRows);
        }
    });
}
