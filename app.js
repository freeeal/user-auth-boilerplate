//===========================================================================================================
// Configure Express application
var express = require('express');
var app = express();
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//===========================================================================================================
var config = require('./config/config');
console.log(config); // for testing
// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// process.env.NODE_ENV variable determines our environment and configures Express app accordingly
if (process.env.NODE_ENV === 'dev') {
  app.use(logger('dev'));
}
else if (process.env.NODE_ENV === 'production') {
  app.use(compress());
}

//===========================================================================================================
// Configuring MongoDB, the database
var db = require('./config/mongoose')();

//===========================================================================================================
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms / support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// View Engine Setup
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');
// Configure static file serving
app.use(express.static(path.join(__dirname, 'public')));

//===========================================================================================================
// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
app.use(expressSession({
    secret: 'abc123',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      url: config.db,
      ttl: 3*24*60*60 // stores session 'time to live (in seconds)'
    })
}));
app.use(passport.initialize()); // passport.initialize() middleware required to initialize Passport
app.use(passport.session()); // passport.session() middleware to support persistent login sessions

//===========================================================================================================
// Using the flash middleware provided by connect-flash to store messages in session and display in templates
var flash = require('connect-flash'); // must be placed after session!
app.use(flash()); // allows creating and retrieving of flash messages

//===========================================================================================================
// Initialize Passport
var initPassport = require('./config/passport/init');
initPassport(passport); // pass passport in for configuration

// ROUTES
var auth = express.Router();
require('./routes/auth')(auth, passport);
app.use('/auth', auth);

var secure = express.Router();
require('./routes/secure')(secure, passport);
app.use('/', secure);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'dev') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//===========================================================================================================
// Start Listening to Server

var server = app.listen(process.env.PORT || 3000, function () {
  console.log('Server listening on port ' + (process.env.PORT || 3000) + '...');
});

module.exports = app;
