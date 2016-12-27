var connection = require("../routes/dbConnection.js");
var async = require('async');

module.exports.setTeachers = function(arrTeachers, callback) {
    var sql_setTeachers = "INSERT INTO teachers (fname, mname, lname, contacts, address, dob, join_date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(sql_setTeachers, arrTeachers, function(error, result) {
        if (!!error) {
            callback(false);
        } else {
            console.log(result);
            callback(result);
        }
    });
}

module.exports.getTeacher = function(arrTeachers, callback) {
    sql_getTeachers = "SELECT * FROM teachers WHERE user_id = ?";
    connection.query(sql_getTeachers, arrTeachers, function(error, result) {
        console.log(result);
        if (!!error) {
            callback(false);
        } else {
            callback(result);
        }
    });
}

module.exports.putTeacher = function(arrTeachers, callback) {
    console.log(arrTeachers);
    var sql_putTeachers = "UPDATE teachers SET fname = ?, mname = ?, lname = ?, contacts = ?, address = ?, dob = ? WHERE id = ?";
    connection.query(sql_putTeachers, arrTeachers, function(error, result) {
        console.log(result);
        if (!!error) {
            console.error(error);
            callback(false);
        } else {
            callback(result);
        }
    });
}

module.exports.getSubjects = function(teacher_id, callback) {
    var sql_getSubjects = "SELECT s.name, c.grade FROM subjects s INNER JOIN classes c ON s.class_id = c.id WHERE s.teacher_id = ?";
    connection.query(sql_getSubjects, teacher_id, function(error, resultRows, fields) {
        if (!!error) {
            console.log(error);
            callback(false);
        } else {
            if (resultRows.length === 0) {
                callback(null);
            } else {
                callback(resultRows);
            }
        }
    });
};

module.exports.setWorks = function(arrWorks, callback) {
    var sql_setWorks = "INSERT INTO works (work_title, created_date, submit_date, work_type, subject_id) VALUES (?, ?, ?, ?, ?)";
    connection.query(sql_setWorks, arrWorks, function(error, result) {
        if (!!error) {
            console.log(error);
            callback(false);
        } else {
            callback(result);
        }
    });
}

module.exports.getWorks = function(subject_id, callback) {
    var sql_getWorks = "SELECT * from works WHERE subject_id = ? ";
    connection.query(sql_getWorks, subject_id, function(error, resultRows, fields) {
        if (!!error) {
            console.error(error);
            callback(false);
        } else {
            callback(resultRows);
        }
    });
}

module.exports.updateWork = function(arrWorks, callback) {
    var sql_updateWork = "UPDATE works SET work_title = ?, submit_date = ?, work_type = ? WHERE id = ?";
    connection.query(sql_updateWork, arrWorks, function(error, result) {
        if (!!error) {
            callback(false);
        } else {
            callback(true);
        }
    });
}

module.exports.deleteWork = function(work_id, callback) {
    var sql_deleteWork = "DELETE FROM works WHERE id = ?";
    connection.query(sql_deleteWork, work_id, function(error, result) {
        if (!!error) {
            console.error(error);
            callback(false);
        } else {
            callback(true);
        }
    });
}

module.exports.setSubjectiveQuestions = function(arrSubjective, cb) {
    var work_id = arrSubjective[1];
    var arrQuestion = arrSubjective[0];
    var status;

    var sql_Question = "INSERT INTO questions (question_title, question_type, weightage_marks, work_id) VALUES (?, ?, ?, ?)";
    async.eachSeries(arrQuestion,
        function(questions, callback) {
            var question = [questions['question'], 's', questions['marks'], work_id];
            connection.query(sql_Question, question, function(error, result) {
                if (!!error) {
                    status = false;
                } else {
                    status = true;
                }
            });
            callback();
        },
        function(error) {
            if (!!error) {
                status = 0;
                cb(status);
                return;
            } else {
                cb(status);
                return;
            }
        });
}

module.exports.setObjectiveQuestions = function(arrObjective, cb) {
    var work_id = arrObjective[1];
    var arrQuestion = arrObjective[0];
    var status;
    var label = [];
    var value = [];
    var answer;
    var lastInsertId;
    var sql_Question = "INSERT INTO questions (question_title, question_type, weightage_marks, work_id) VALUES (?, ?, ?, ?)";
    var sql_objectiveAnswer = "INSERT INTO options (label, opt, question_id) VALUES (?, ?, ?)";
    var sql_updateQuestionsTable = "UPDATE questions SET option_id = ? WHERE id = ?";
    async.eachSeries(arrQuestion, function(questions, cb1) {
            var question = [questions['question'], 'o', questions['mark'], work_id];
            answer = questions['answer'];
            var options = questions['options'];
            connection.query(sql_Question, question, function(error, resultRows) {
                if (!!error) {
                    console.log('error in insert question');
                    console.error(error);
                    cb(false);
                } else {
                    var label = options.map((option) => option.label);
                    var value = options.map((option) => option.value);
                    var count = 0;
                    //count = parseInt(count);
                    async.eachSeries(label, function(eachLevel, callback) {
                            var arrOption = [eachLevel, value[count], resultRows['insertId']];
                            connection.query(sql_objectiveAnswer, arrOption, function(error, valueRows) {
                                if (!!error) {
                                    console.log(error);
                                    cb(false);
                                } else {
                                    console.log('ans' + label[count]);
                                    if (answer === label[count]) {
                                        console.log(label[count]);
                                        lastInsertId = valueRows['insertId'];
                                        connection.query(sql_updateQuestionsTable, [lastInsertId, resultRows['insertId']], function(err, updateResult) {
                                            if (!!error) {
                                                console.log("update errrrrr");
                                                console.error(error);
                                                cb(false);
                                            } else {
                                                console.log('working');
                                                console.log(updateResult);
                                                count = parseInt(count) + 1;
                                                callback();
                                            }
                                        });
                                    }

                                }
                            });
                        },
                        function(error) {
                            if (!!error) {
                                console.log('hhh');
                                console.log(error);
                                status = 0;
                                cb(status);
                            }
                        });
                }
            });
            cb1();
        },
        function(error) {
            if (!!error) {
                status = 0;
                cb(status);
            } else {
                cb(status);
            }
        });
}

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
                        var count = 0;
                        async.eachSeries(id, function(getId, optionCallback) {
                                connection.query(sql_getOptions, getId, function(error, optionResult) {
                                    console.log("Query");
                                    if (!!error) {
                                        callback(false);
                                    } else {
                                        option.push(optionResult[count]);
                                        count += count;
                                        optionCallback();
                                    }
                                });
                                console.log("Callback");

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

module.exports.updateQuestions = function(arrQuestions, callback) {
    var arrQuestion = arrQuestions.slice(0, 3);
    var question_id = arrQuestions[2];
    if (arrQuestions.length === 3) {
        var sql_updateQuestion = "UPDATE questions SET question_title = ?, weightage_marks = ? WHERE id = ?";
        connection.query(sql_updateQuestion, arrQuestions, function(error, result) {
            if (!!error) {
                callback(false);
            } else {
                callback(true);
            }
        });
    }

    if (arrQuestions.length === 4) {
        var options = arrQuestions[3];
        var sql_updateQuestion = "UPDATE questions SET question_title = ?, weightage_marks = ? WHERE id = ?";
        var sql_updateOptions = "UPDATE options SET label = ?, opt = ? WHERE id = ?";
        var sql_updateOptionsQuestion = "UPDATE questions SET option_id = ? WHERE id = ?";
        var updateId;
        async.parallel([
                function(callbackOption) {
                    connection.query(sql_updateQuestion, arrQuestion, function(error, result) {
                        if (!!error) {
                            console.error('update question');
                            console.error(error);
                            callback(false);
                        } else {
                            console.log('question table updated');
                            callbackOption();
                        }
                    });
                },
                function(callbackOption) {
                    async.eachSeries(options, function(option, repeatOption) {
                            console.log(option);
                            var answer = option.answer;
                            var finalValue = option.option;
                            var optionId = option.id;
                            var count = 0;
                            async.eachSeries(finalValue, function(getValues, repeatValue) {
                                    var label = getValues.label;
                                    var value = getValues.value;
                                    if (answer === label) {
                                        updateId = optionId[count];
                                        console.log(answer + '=====' + label);
                                        console.log('have id :' + updateId);
                                    }
                                    var putValues = [label, value, optionId[count]];
                                    console.log(putValues);
                                    connection.query(sql_updateOptions, putValues, function(error, result) {
                                        if (!!error) {
                                            console.log('option update');
                                            console.error(error);
                                            callback(false);
                                        } else {
                                            console.log(result);
                                            console.log(count);
                                            count = count + 1;
                                            repeatValue();
                                        }
                                    });
                                },
                                function(error) {
                                    if (!!error) {
                                        callback(false);
                                    } else {
                                        var updateOptionsQuestion = [question_id, updateId];
                                        console.log(updateOptionsQuestion);
                                        connection.query(sql_updateOptionsQuestion, updateOptionsQuestion, function(error, result) {
                                            if (!!error) {
                                                console.log('option question');
                                                console.log(error);
                                                callback(false);
                                            } else {
                                                repeatOption();
                                            }
                                        });
                                    }
                                });
                        },
                        function(error) {
                            if (!!error) {
                                console.error(error);
                                callback(false);
                            } else {
                                console.log('here');
                                callbackOption();
                            }
                        });
                }
            ],
            function(error, result) {
                if (!!error) {
                    console.error(error);
                    callback(false);
                } else {
                    console.log('pppppppppppppppppppppppp');
                    callback(true)
                }
            });
    }
}

module.exports.deleteQuestion = function(arrQuestion, callback) {
    var q_id = arrQuestion[0];
    var question_type = arrQuestion[1];
    var sql_deleteQuestion;
    async.waterfall([
            function(cb) {
                if (question_type === 'o') {
                    var sql_updateQuestion = "UPDATE questions SET option_id = NULL WHERE id = ?";
                    connection.query(sql_updateQuestion, q_id, function(error, result) {
                        if (!!error) {
                            callback(false);
                        } else {
                            cb(null);
                        }
                    });
                } else {
                    cb(null);
                }
            }
        ],
        function(error, result) {
            if (!!error) {
                callback(false);
            } else {
              var sql_deleteQuestion = "DELETE FROM questions WHERE id = ?";
              connection.query(sql_deleteQuestion, q_id, function(error, result) {
                  if (error) {
                      console.error(error);
                      callback(false);
                  } else
                      callback(true);
              });
            }
        });

}

module.exports.getStudentanswers = function(callback){
  var sql_getStudentAnsewers = "SELECT * FROM studentanswers";
  connection.query(sql_getStudentAnsewers, function(error, answerRows){
      if (!!error) {
        console.error(error);
        callback(false);
      }else{
        callback(answerRows);
      }
  });
}

module.exports.putMarks = function(arrMarks, callback){
  var sql_putMarks = "UPDATE studentanswers SET weightage_marks = ? WHERE std_id = ? AND question_id= ? ";
  connection.query(sql_putMarks, arrMarks, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    } else {
      callback(true);
    }
  });
}

module.exports.setResults = function(arrResult, callback){
  var sql_setResults ="INSERT INTO results (std_id, work_id, feedback, obtained_marks) VALUES (?, ?, ?, ?)";
  connection.query(sql_setResults, arrResult, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    }else {
      callbakc(true);
    }
  });
}
