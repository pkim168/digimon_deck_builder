const createError = require('http-errors');
const express = require('express');
const vhost = require('vhost');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const bodyParser = require('body-parser');
const config = require('./config');
const formidable = require('express-formidable');
const expressValidator = require('express-validator');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();
const admin = express();

const domain =
    process.NODE_ENV === "production" ? "digidecks.com" : "digidecks.local";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(vhost(`admin.${domain}`, admin));
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// Set up secret from config file
app.set('supersecret', config.secret)

const pool = require('./controllers/mongodbpool');
pool.connectToServer( function (err) {

  app.options('*', cors({ allowedHeaders: 'x-access-token'}));
  app.use(mongoSanitize({replaceWith: '_'}));
  app.options('/', cors());
  var loginRoute = require('./routes/login.routes');
  var cardsRouter = require('./routes/cards.routes');
  var decksRouter = require('./routes/decks.routes');
  var usersRouter = require('./routes/users.routes');
  var adminRoute = require('./routes/admin.routes');
  app.use('/', loginRoute);
  app.use('/users', usersRouter);
  app.use('/cards', cardsRouter);
  app.use('/decks', decksRouter);
  app.use(express.static("public"));
  admin.use('/', adminRoute);
  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })

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
});


module.exports = app;
