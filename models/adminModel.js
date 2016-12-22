var connection = require("../routes/dbConnection.js");

module.exports.setSections = function(arrSection, callback){
  var sql_setSections = "INSERT INTO sections (name) VALUES (?)";
  connection.query(sql_setSections, arrSection, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    }else {
      callback(result);
    }
  });
};

module.exports.getSections = function(callback){
  var sql_getSections = "SELECT * FROM sections";
  connection.query(sql_getSections, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    }else {
      callback(result);
    }
  });
};

module.exports.putSection = function(arrSection, callback){
  var sql_putSection = "UPDATE sections SET name = ? WHERE id = ?";
  connection.query(sql_putSection, arrSection, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    }else {
      callback(true);
    }
  });
};

module.exports.deleteSection = function(section_id, callback){
  var sql_deleteSection = "DELETE FROM sections WHERE id = ?";
  connection.query(sql_deleteSection, section_id, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    }else {
      callback(true);
    }
  });
};

module.exports.setClasses = function(arrClass, callback){
  var sql_setClasses = "INSERT INTO classes (grade, sec_id) VALUES (?, ?)";
  connection.query(sql_setClasses, arrClass, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    }else {
      callback(result);
    }
  });
};

module.exports.getclasses = function(callback){
  console.log('models.....');
  var sql_getClasses = "SELECT c.id, c.sec_id, c.grade, s.name FROM classes c INNER JOIN sections s ON c.sec_id = s.id";
  connection.query(sql_getClasses, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    }else {
      console.log(result);
      callback(result);
    }
  });
};

module.exports.putClass = function(arrClass, callback){
  var sql_putClass = "UPDATE classes SET grade = ? WHERE id = ?";
  connection.query(sql_putClass, arrClass, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    }else {
      callback(true);
    }
  });
};

module.exports.deleteClass = function(class_id, callback){
  var sql_deleteClass = "DELETE FROM classes WHERE id = ?";
  connection.query(sql_deleteClass, class_id, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    }else {
      callback(true);
    }
  });
};

module.exports.setSubjects = function(arrSubjects, callback){
  var sql_setSubjects = "INSERT INTO subjects (name, class_id, teacher_id) VALUES (?, ?, ?)";
  connection.query(sql_setSubjects, arrSubjects, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    }else {
      callback(result);
    }
  });
};

module.exports.getSubjects = function(subject_id, callback){
  var sql_getClasses = "SELECT s.id, s.name, c.grade FROM subjects s INNER JOIN classes c ON s.class_id = c.id WHERE s.class_id = ?";
  connection.query(sql_getClasses, subject_id, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    }else {
      console.log(result);
      callback(result);
    }
  });
};

module.exports.putSubject = function(arrSubject, callback){
  var sql_putSubject = "UPDATE subjects SET name = ?, class_id = ?, teacher_id = ? WHERE id = ?";
  connection.query(sql_putSubject, arrSubject, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    }else {
      callback(true);
    }
  });
};

module.exports.deleteSubject = function(subject_id, callback){
  var sql_deleteSubject = "DELETE FROM subjects WHERE id = ?";
  connection.query(sql_deleteSubject, subject_id, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    }else {
      callback(true);
    }
  });
};
