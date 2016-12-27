var connection = require("../routes/dbConnection.js");
var async = require('async');

module.exports.setStudents = function(arrStudents, callback) {
    var sql_setStudents = "INSERT INTO students (fname, mname, lname, dob, join_date, address, contact, class_id, user_id) VALUES (?, ?, ?, ?, ?, ?,? ,? ,?)";
    connection.query(sql_setStudents, arrStudents, function(error, result) {
        if (!!error) {
            console.error(error);
            callback(false);
        } else {
            console.log(result);
            callback(result);
        }
    });
}

module.exports.getStudents = function(user_id, callback) {
    var sql_getStudents = "SELECT * FROM students WHERE user_id = ? ";
    connection.query(sql_getStudents, user_id, function(error, resultRows, fields) {
        if (!!error) {
            console.error(error);
            callback(false);
        } else {
            callback(resultRows);
        }
    });
};

module.exports.putStudent = function(arrStudents, callback) {
    var sql_putStudents = "UPDATE students SET fname = ?, mname = ?, lname = ?, contact = ?, address = ?, dob = ? WHERE id = ?";
    connection.query(sql_putStudents, arrStudents, function(error, result) {
        console.log(result);
        if (!!error) {
            console.error(error);
            callback(false);
        } else {
            callback(result);
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
                    if (questionRows[0].option_id === answers[count] && questionRows[0].question_type === 'o') {
                      console.log('yyy');
                        answerMarks.push(questionRows[0].weightage_marks);
                        count = parseInt(count)+1;
                        questionCallback();
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
