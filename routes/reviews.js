const express = require('express');
const router = express.Router();
const Review = require('../models/review.js');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require('../middleware.js');

router.post(
  '/:id/reviews',
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'created new review');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  '/:id/reviews/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'succesfully delete review');
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
