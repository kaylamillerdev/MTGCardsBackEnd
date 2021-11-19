const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoDbStore = require('connect-mongo');
const cors = require('cors');
const mongoose = require('mongoose');
const Config = require('./config/config');
const hbs = require('hbs');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// public folder setup
app.use(express.static(path.join(__dirname, 'public')));
//app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist"));

// Adding in the mongoose stuff
mongoose.connect(Config.uri);
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected at port 27017')
});
mongoose.connection.on('error', (err) => {
  console.log(err)
});

// CORS Middleware
app.use(cors());

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
      secret: Config.secretKey,
      resave: false,
      saveUninitialized: true,
      store: MongoDbStore.create({
        mongoUrl: Config.uri
      })
    })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

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
