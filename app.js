require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const { notifications } = require('./middlewares/auth');

const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

// Routes
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const eventsRouter = require('./routes/events');
const EstablishmentsRouter = require('./routes/establishments');
const bandsRouter = require('./routes/bands');

// mongodb connect MONGO ATLAS DEPLOY
(async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URI}`, {
      useNewUrlParser: true,
    });
    console.log(
      `Connected to Mongo! Database name: "${connection.connections[0].db.s.databaseName}"`,
    );
  } catch (err) {
    console.log('Error connecting to Mongo database.', err);
  }
})();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true,
  }),
);
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
    secret: process.env.SESSION_SECRET || 'ironplay',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(flash());

app.use((req, res, next) => {
  app.locals.currentUser = req.session.currentUser;
  next();
});

app.use(notifications(app));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/events', eventsRouter);
app.use('/establishments', EstablishmentsRouter);
app.use('/bands', bandsRouter);

// app.use((req, res, next) => {
//   // app.locals.currentUser = req.session.currentUser;
//   res.locals.currentUser = req.session.currentUser;
//   next();
// });

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
