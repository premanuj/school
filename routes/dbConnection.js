var express = require('express');
var mysql = require('mysql');
/*
*--------------------------------------------------
*Database connection
*--------------------------------------------------
*/

// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'school'
// });

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'school'
});

connection.connect();

module.exports = connection;
