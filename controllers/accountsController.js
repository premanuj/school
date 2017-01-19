var express = require('express');
var router = express.Router();
var async = require('async');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var sendResponse = require('../routes/sendResponse');
var useFunction = require('../routes/useFunction');
var accountsModels = require('../models/accountsModel');
var dbConnection = require('../routes/dbConnection');
var app = express();

var validate = require('express-validation');
var validation = require('./validation');

app.set('Secret', dbConnection.secret);

router.post('/roles', function(req, res, next) {
    var type = req.body.type;
    console.log(type);
    accountsModels.setRoles(type, function(result) {
        if (result != false) {
            var data = {
                'id': result['insertId'],
                'type': type
            };
            sendResponse.sendSuccessData(data, res);
        } else {
            var errorMsg = "Error during Insertation.";
            sendResponse.sendErrorMessage(errorMsg, res);
        }
    });
});

router.get('/roles', function(req, res, next) {
    accountsModels.getRoles(function(result) {
        var data = [];
        if (result != false) {
            result.forEach(function(value) {
                data.push({
                    "id": value['id'],
                    "type": value['type'],
                    "uri": "roles/" + value['id']
                });
            });
            sendResponse.sendSuccessData(data, res);
        } else {
            var errorMsg = "Error during fetching data";
            sendResponse.sendErrorMessage(errorMsg, res);
        }
    });
});

router.put('/roles/:id', function(req, res, next) {
    var id = req.params.id;
    var type = req.body.type;
    var arrRoles = [type, id];
    accountsModels.updateRole(arrRoles, function(result) {
        if (result != false) {
            var data = {
                "id": id,
                "type": type
            };
            sendResponse.sendSuccessData(data, res);
        } else {
            var errorMsg = "Error during updation."
            sendResponse.sendErrorMessage(errorMsg, res);
        }
    });
});

router.delete('/roles/:id', function(req, res, next) {
    var id = req.params.id;
    accountsModels.deleteRole(id, function(result) {
        if (result === true) {
            var successMsg = "Roles with id = " + id + " deleted Successfully.";
            sendResponse.successStatusMsg(successMsg, res);
        } else {
            var errorMsg = "Error during deletion.";
            sendResponse.sendErrorMessage(errorMsg, res);
        }
    });
});

router.post('/roles/:role_id/users', function(req, res, next) {
    var role_id = req.params.role_id;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var access_token = md5(email + new Date());
    var verification_token = md5(username + new Date());
    var password = md5(password + new Date());
    var checkFields = [role_id, email, username, password];
    console.log(checkFields);
    var arrUsers = [email, username, password, access_token, verification_token, role_id];
    async.waterfall([
            function(callback) {
                useFunction.checkFields(res, checkFields, callback);
            },function(callback){
              accountsModels.checkEmail(email, function(result){
                if (result===true) {
                  callback();
                } else {
                  var errorMsg = "Email already exist. Please enter another email.";
                  sendResponse.sendErrorMessage(errorMsg, res);
                }
              });
            },function(callback){
              accountsModels.checkUsername(username, function(result){
                if (result===true) {
                  callback();
                } else {
                  var errorMsg = "User already exist. Please enter another username.";
                  sendResponse.sendErrorMessage(errorMsg, res);
                }
              });
            }
        ],
        function(error, result) {
            if (error) {
                console.log('error');
                console.error(error);
                sendResponse.someThingWrongError(res);
            } else {
                accountsModels.setUsers(arrUsers, function(result) {
                    if (result != false) {
                        var data = {
                            'id' : result['insertId'],
                            'email': email,
                            'username': username,
                            'access_token': result['access_token']
                        };
                        sendResponse.sendSuccessData(data, res);
                    } else {
                        var errorMsg = "Data insertaion error.";
                        sendResponse.sendErrorMessage(errorMsg, res);
                    }
                });
            }
        });
});

router.get('/roles/:role_id/users', function(req, res, next){
  var role_id = req.params.role_id;
  accountsModels.getUsers(role_id, function(result){
    console.log(result);
    var data = [];
    if (result!=false) {
      result.forEach(function(value){
         data.push({'user_id': value['id'], 'email': value['email'], 'username': value['username'], 'role_id': role_id, 'uri': 'roles/'+role_id+'/users/'+value['id']});
      });
      sendResponse.sendSuccessData(data, res);
    } else {
      var errorMsg = "No user available under this role.";
      sendResponse.sendErrorMessage(errorMsg, res);
    }
  });
});

router.delete('/roles/:role_id/users/:user_id', function(req, res, next){
  var role_id = req.params.role_id;
  var user_id = req.params.user_id;
  var arrUsers = [role_id, user_id];
  accountsModels.deleteUsers(arrUsers, function(result){
    if (result===false) {
      var errorMsg = "Deletion Unsuccessfull.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var successMsg = "Deletion successful.";
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});

router.post('/roles/:role_id/users/login', function(req, res, next){
  console.log('workig');
  var password = req.body.password;
  var role_id = req.params.role_id;
  password = md5(password);
  var user;
  async.parallel([
    function(callback){
      if(req.body.email){
        user = req.body.email;
        accountsModels.checkEmail(user, function(result){
          if (result===0) {
            console.log('here');
            callback();
          } else {
            var errorMsg = "Email doesn't exist";
            sendResponse.sendErrorMessage(errorMsg, res);
          }
        });
      }else {
        user = req.body.username;
        accountsModels.checkUsername(user, function(result){
          if (result===0) {
            callback();
          } else {
            var errorMsg = "Username doesn't exist";
            sendResponse.sendErrorMessage(errorMsg, res);
          }
        });
      }
    }], function(error, result){
      if (error) {
        console.error(error);
        var errorMsg = "Error Occour";
        sendResponse.sendErrorMessage(errorMsg, res);
      } else {
        arrUsers = [user, user, password, role_id];
        accountsModels.checkUser(arrUsers, function(result){
          if (result===false) {
            var errorMsg = "Invalid Login Credentials";
            sendResponse.sendErrorMessage(errorMsg, res);
          } else {
            console.log('role_id:' + role_id);
            if (role_id==='1') {
                req.session.admin = user;
                console.log('admin_session:');
                console.log(req.session.admin);
            }
            if (role_id==='2') {
              req.session.student = user;
              console.log('student_session');
              console.log(req.session.student);
            }
            if (role_id==='3') {
              req.session.teacher = user;
              console.log('teacher_session');
              console.log(req.session.teacher);
            }
            var data = {'id': result[0]['id'], 'email': result[0]['email'], 'username':result[0]['username'], 'access_token':result[0]['access_token'], 'role_id':result[0]['role_id']};
            console.log(data);
            sendResponse.sendSuccessData(data, res);
          }
        });
      }
    });
});



module.exports = router;
