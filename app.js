var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var goodsRouter = require('./routes/goods');
var usersRouter = require('./routes/users');

var app = express();
var config = require('./config/database.js')
const mongoose = require('mongoose');
mongoose.connect(config.database,{useNewUrlParser:true,useUnifiedTopology:true});
let db = mongoose.connection; // 创建一个连接放在db中

db.once('open', function() {
    console.log('MongoDB连接成功..');
})
db.on('error', function(err) {
    console.log(err);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/goods', goodsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
