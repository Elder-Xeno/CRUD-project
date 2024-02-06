const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const multer = require('multer');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const boardgamesRouter = require('./routes/boardgames');

const app = express();
const port = process.env.PORT || 3002;

require('dotenv').config();
require('./config/database');
require('./config/passport');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.APP_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

// Set up multer middleware for file uploads
app.use(upload.single('image'));

// Routes setup
app.use('/', indexRouter);
app.use('/boardgames', boardgamesRouter);

// Static files setup
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
