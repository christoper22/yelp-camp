const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const Campground = require('./models/campground');
const review = require('./models/review');

const isLoggedIn = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = await req.originalUrl;
    // console.log('path', req.originalUrl);
    req.flash('error', 'you must be sign in');
    return res.redirect('/login');
  }
  next();
};

const validateCampground = (req, res, next) => {
  // console.log(req.body);
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  // console.log('user', req.user_id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', ' you dont have permission todo that');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const reviews = await review.findById(reviewId);
  if (!reviews.author.equals(req.user._id)) {
    req.flash('error', ' you dont have permission todo that');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
module.exports = {
  isLoggedIn,
  validateCampground,
  isAuthor,
  validateReview,
  isReviewAuthor,
};
