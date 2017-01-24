var connection = require("../routes/dbConnection.js");

module.exports.setRoles = function(arrRoles, callback) {
    var sql_setRoles = "INSERT INTO roles (type) VALUES (?)";
    connection.query(sql_setRoles, arrRoles, function(error, result) {
        if (result) {
            console.log(result);
            callback(result);
        } else {
            console.error(error);
            callback(false);
        }
    });
}

module.exports.getRoles = function(callback) {
    var sql_getRoles = "SELECT * FROM roles";
    connection.query(sql_getRoles, function(error, result) {
        if (result) {
            callback(result);
        } else {
            console.error(error);
            callback(false);
        }
    });
}

module.exports.updateRole = function(arrRoles, callback) {
    console.log(arrRoles);
    var sql_updateRoles = "UPDATE roles SET type = ? WHERE id = ?";
    connection.query(sql_updateRoles, arrRoles, function(error, result) {
        if (result) {
            callback(true);
        } else {
            console.error(error);
            callback(false);
        }
    });
}

module.exports.deleteRole = function(arrRoles, callback) {
    var sql_deleteRoles = "DELETE FROM roles WHERE id = ?";
    connection.query(sql_deleteRoles, arrRoles, function(error, result) {
        if (result) {
            callback(true);
        } else {
            console.error(error);
            callback(false);
        }
    });
}

module.exports.setUsers = function(arrUsers, callback) {
    var sql_setUsers = "INSERT INTO users (email, username, password, access_token, verification_token, role_id) values (?, ?, ?, ?, ?, ?)";
    connection.query(sql_setUsers, arrUsers, function(error, result) {
        if (result) {
            callback(true);
        } else {
            console.error(error);
            callback(false);
        }
    });
}

module.exports.getUsers = function(role_id, callback){
  var sql_getUsers = "SELECT * FROM users WHERE role_id = ?";
  connection.query(sql_getUsers, role_id, function(error, result){
    if (!!error) {

      console.error(error);
      callback(false);
    } else {
      callback(result);
    }
  });
}

module.exports.deleteUsers = function(arrUsers, callback){
  var sql_deleteUsers = "DELETE FROM users WHERE role_id = ? AND id = ?";
  connection.query(sql_deleteUsers, arrUsers, function(error, result){
    if (!!error) {
      console.error(error);
      callback(false);
    } else {
      callback(true);
    }
  });
}

module.exports.checkEmail = function(email, callback) {
    var sql_checkEmail = "SELECT * FROM users WHERE email = ?";
    connection.query(sql_checkEmail, email, function(error, result) {
        if (error) {
          console.log(error);
            callback(false);
        } else {
            if (result.length > 0) {
                callback(0);
            } else {
                callback(true);
            }
        }
    });
}

module.exports.checkUsername = function(username, callback) {
    var sql_checkUsername = "SELECT * FROM users WHERE username = ?";
    connection.query(sql_checkUsername, username, function(error, result) {
        if (result.length > 0) {
            callback(0);
        } else {
            callback(true);
        }
    });
}


module.exports.checkUser = function(user, callback){
  var sql_checkUser = "SELECT * FROM users WHERE (username = ? OR email = ? ) AND password = ? AND role_id = ?";
  connection.query(sql_checkUser, user, function(error, userRows, fields){
    if (error) {
      console.error(error);
      callback(false);
    } else {
      console.log(userRows.length);
      if(userRows.length>0){
        callback(userRows);
      }else {
        callback(false);
      }
    }
  });
}
