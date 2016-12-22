var connection = require("../routes/dbConnection.js");

module.exports.setTeachers = function(arrTeachers, callback){
    sql_setTeachers = "INSERT INTO teachers (fname, mname, lname, contacts, address, dob, join_date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(sql_setTeachers, arrTeachers, function(error, result){
      if(!!error){
        callback(false);
      }else{
        console.log(result);
        callback(result);
      }
    });
}

module.exports.getTeacher = function(arrTeachers, callback){
    sql_getTeachers = "SELECT * FROM teachers WHERE user_id = ?";
    connection.query(sql_getTeachers, arrTeachers, function(error, result){
      console.log(result);
      if(!!error){
        callback(false);
      }else{
        callback(result);
      }
    });
}

module.exports.putTeacher = function(arrTeachers, callback){
  console.log(arrTeachers);
    var sql_putTeachers = "UPDATE teachers SET fname = ?, mname = ?, lname = ?, contacts = ?, address = ?, dob = ? WHERE id = ?";
    connection.query(sql_putTeachers, arrTeachers, function(error, result){
      console.log(result);
      if(!!error){
        console.error(error);
        callback(false);
      }else{
        callback(result);
      }
    });
}

module.exports.getSubjects = function(teacher_id, callback){
  var sql_getSubjects = "SELECT s.name, c.grade FROM subjects s INNER JOIN classes c ON s.class_id = c.id WHERE s.teacher_id = ?";
  connection.query(sql_getSubjects, teacher_id, function(error, resultRows, fields){
    if(!!error){
      console.log(error);
      callback(false);
    }else{
      if(resultRows.length===0){
       callback(null);
     }else{
       callback(resultRows);
     }
    }
  });
};

module.exports.setWorks = function(arrWorks, callback){
  var sql_setWorks = "INSERT INTO works (work_title, created_date, submit_date, work_type, subject_id) VALUES (?, ?, ?, ?, ?)";
  connection.query(sql_setWorks, arrWorks, function(error, result){
    if(!!error){
      console.log(error);
      callback(false);
    }else{
      callback(result);
    }
  });
}

module.exports.getWorks = function(subject_id, callback){
  var sql_getWorks = "SELECT * from works WHERE subject_id = ? ";
  connection.query(sql_getWorks, subject_id, function(error, resultRows, fields){
    if(!!error){
      console.error(error);
      callback(false);
    }else {
      callback(resultRows);
    }
  });
}

module.exports.updateWork = function(arrWorks, callback){
  var sql_updateWork = "UPDATE works SET work_title = ?, submit_date = ?, work_type = ? WHERE id = ?";
  connection.query(sql_updateWork, arrWorks, function(error, result){
    if(!!error){
      callback(false);
    }else {
      callback(true);
    }
  });
}

module.exports.deleteWork = function(work_id, callback){
  var sql_deleteWork = "DELETE FROM works WHERE id = ?";
  connection.query(sql_deleteWork, work_id, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    } else {
      callback(true);
    }
  });
}
