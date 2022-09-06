const express = require('express');
const router = express.Router();
const reviews = require('../controllers/reviews');
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
  catchAsync(reviews.createReview)
);

router.delete(
  '/:id/reviews/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
