import createError from 'http-errors';
import express, { json, urlencoded, statics } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { sequelize } from './models/index.js';
import { initialize, session as _session } from 'passport';
import session from 'express-session';

import cors from 'cors';
import routes from './routes/index';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

var app = express();

app.use(cors);


app.use(json());

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'hbs');



app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(statics(join(__dirname, 'public')));

app.use(session({ secret: 'perilous journey' }));
app.use(initialize());
app.use(_session());

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

sequelize.sync().then(function () {
    console.log("DB Sync'd up")
});

export default app;
