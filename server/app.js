var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    methods = require('methods'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    passport = require('passport'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose');

var isProduction = process.env.NODE_ENV === 'production';

// Create global app object
var app = express();
console.log('process.env.CLIENT_ORIGIN: ', process.env.CLIENT_ORIGIN);

// METHOD 1
// app.options('*', cors()); // SEE: https://github.com/expressjs/cors#enabling-cors-pre-flight
// app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:8080' })); // added origin k:V pair to fix No 'Allow-Access-Control-Allow-Origin' issue

// METHOD 2 - doesn't work on PROD
app.use(function(req, res, next) {
    // NOTE: these are custom headers returned to browser
    
    // res.header("Access-Control-Allow-Origin", '*');
    console.log('res.headers.origin: ', res.headers.origin);
    res.header("Access-Control-Allow-Origin", req.headers.origin);

    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // NOTE: these refer to 'Request Headers' key in Network tab
    // res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    res.header("Access-Control-Allow-Headers", 'Accept, Authorization, Content-Type, Origin, Referer, User-Agent');

    if (req.method === 'OPTIONS') res.sendStatus(200); // required for pre flight OPTIONS requests SEE: https://stackoverflow.com/questions/11001817/allow-cors-rest-request-to-a-express-node-js-application-on-heroku
    else next();
});

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));
// console.log(__dirname + '/public');

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

if (!isProduction) {
  app.use(errorhandler());
}

if(isProduction){
  mongoose.connect(process.env.MONGODB_URI); // MongoLAB web dashboard => https://www.mlab.com/databases/heroku_2j416hmk#users
} else {
  mongoose.connect('mongodb://localhost/todotomatoinator')
  mongoose.set('debug', true);
}

require('./models/User');
require('./models/Project');
require('./models/Task');
require('./models/Note');
require('./models/Step');
require('./models/PomTracker');
require('./config/passport');

app.use(require('./routes'));
app.use(require('./routes/api'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

// finally, let's start our server...
var server = app.listen( process.env.PORT || 3000, function(){
// var server = app.listen(3000, function(){
  console.log('Listening on port ' + server.address().port);
});
