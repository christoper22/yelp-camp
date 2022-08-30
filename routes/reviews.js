const express = require('express');
const router = express.Router();
const { reviewSchema } = require('../schemas.js');
const Review = require('../models/review.js');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  '/:id/reviews',
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'created new review');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  '/:id/reviews/:reviewId',
  catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'succesfully delete review');
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
