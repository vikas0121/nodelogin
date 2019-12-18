var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session')
const connectDB = require('./config/db');
const config = require('config');
const db = config.get('mongoURI');


// Connect to database
connectDB();

app.use(session({
  secret: 'ssshhhhh',
  saveUninitialized: true,
  resave: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(__dirname + '/views'));

var index = require('./routes/index');
app.use('/', index);
var mobileverification = require('./routes/mobileverification');
app.use('/mobile', mobileverification);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 3000

app.listen(process.env.PORT || 3000, function () {
  console.log('Express app listening on port 3000');
});