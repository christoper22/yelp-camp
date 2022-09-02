//dependencie
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');

// routes
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

//error handler
const ExpressError = require('./utils/ExpressError');

// model
const User = require('./models/user');

// connection
mongoose
  .connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DATABASE CONNECTED');
  })
  .catch((err) => {
    console.log('CANNOT CONNECT DATABASE');
    console.log(err);
  });

const app = express();

// session setting
const sessionConfig = {
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // untuk ngeset biar client lain ngak bisa akseskodenya
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // ms*second*minute*day*week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // console.log('asda', req.session.returnTo);
  req.newPath = req.session.returnTo;
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', usersRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds', reviewRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

app.all('*', (req, res, next) => {
  next(new ExpressError('PAGE NOT FOUND', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'oh no ,something went wrong!!';
  return res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log('serving on port 3000.');
});
