const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const { query } = require('express');
const ExpressError = require('./utils/ExpressError');
const campgrounds = require('./routes/campground');
const reviews = require('./routes/reviews');

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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('home');
});

app.use('/campgrounds', campgrounds);
app.use('/campgrounds', reviews);

app.all('*', (req, res, next) => {
  next(new ExpressError('PAGE NOT FOUND', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'oh no ,something went wrong!!';
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log('serving on port 3000.');
});
