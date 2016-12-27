var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var accountsController = require('./controllers/accountsController');
var teachersController = require('./controllers/teachersController');
var adminController = require('./controllers/adminController');
var studentsController = require('./controllers/studentsController');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'freakoids@123', resave:false, saveUninitialized:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.use('/api', accountsController);
app.use('/api', teachersController);
app.use('/api', adminController);
app.use('/api', studentsController);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(4040);
console.log('You are listening to port 4040.');

module.exports = app;
