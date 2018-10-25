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

/* --------------------------------------------- REDIRECTING FROM HTTP => HTTPS ------------------------------------------------------- */
// @wip NOTE: redirect from http (mobile) to https with following code from https://jaketrent.com/post/https-redirect-node-heroku/
// app.configure('production', () => { // ** NOTE: ERROR: "app.configure not a function" - NO LONGER A PART OF EXPRESS 4 (USE if block for env specific configurations)
// // ***** NOTE: uncomment entire block below to continue work... DON'T use req.header('referer') as it will not always be present (may ONLY be in OPTIONS req's?) and is a security flaw!
// if (isProduction) {
//   app.use(function(req, res, next) {

//     console.log('CONFIGURED IN PROD')
//     console.log('*** req.url: ', req.url);
//     console.log('*** req-origin: ', req.header('origin'))
//     console.log('*** req.headers: ', req.headers)

//     // if (req.header('x-forwarded-proto') !== 'https') // *appears that x-forwaded-proto always equals 'https' in Heroku, even when request comes from http on mobile (?)    
//     // if (!req.header('referer').startsWith('https')) { // NOTE: DON'T USE THE referer HEADER FOR ANY MATTER OF IMPORTANCE!! see: https://stackoverflow.com/questions/8319862/can-i-rely-on-referer-http-header
//     if (!req.header('origin').startsWith('https')) {
//       console.log('http redirected!!!!')
//       res.redirect(`https://${req.header('host')}${req.url}`)
//       // QUESTION => add next() here, as remainder of app.use(..) calls aren't executed ???
//     } else {
//       console.log('request sent via https')
//       next()
//     }
//   });
// }
// // });

// set up a route to redirect http to https - SEE: https://stackoverflow.com/questions/7450940/automatic-https-connection-redirect-with-node-js-express
if (isProduction) {
  app.get('*', function(req, res, next) {  
    console.log('req.secure: ', req.secure);
    if (!req.header('origin').startsWith('https')) {
      console.log('HTTP redirected!')
      res.redirect(`https://${req.header('host')}${req.url}`);
      // res.redirect('https://' + req.headers.host + req.url);
    } else {
      console.log('HTTPS sent!')
      next();
    }
  })
}
/* -------------------------------------------------------------------------------------------------------------------------------------- */

// METHOD 1
// app.use(cors());
// app.options('*', cors()); // SEE: https://github.com/expressjs/cors#enabling-cors-pre-flight
// app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:8080' })); // added origin k:V pair to fix No 'Allow-Access-Control-Allow-Origin' issue

// METHOD 1.5
// app.options('*', cors());
// app.use(cors({ credentials: true })); // SEE: https://medium.com/@ahsan.ayaz/how-to-handle-cors-in-an-angular2-and-node-express-applications-eb3de412abef

// METHOD 2
// NOTE: app.use() attaches to main middleware stack(PROLLY WHAT WE WANT) || app.all() applies to all HTTP methods - prolly trying to attach header to res after its been set? SEE: https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
app.use(function(req, res, next) { // was app.use before SEE: https://stackoverflow.com/questions/14125997/difference-between-app-all-and-app-use
    // if (!req.get('Origin')) return next();
    
    console.log('REQUEST HEADERS:') 
    console.log(req.headers)

    // ** NOTE: these are custom headers returned to the browser, which will compare them to sent Access-Control-Request-<values> **
    let allowedOrigin = isProduction ? 'https://todo-tomatoinator.herokuapp.com' : 'http://localhost:8080';    
    res.header("Access-Control-Allow-Origin", allowedOrigin);

    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
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
