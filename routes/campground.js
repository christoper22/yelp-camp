const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campground = require('../controllers/campground');

router
  .route('/')
  .get(catchAsync(campground.index))
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(campground.createCampground)
  );

router.get('/new', isLoggedIn, catchAsync(campground.renderNewForm));

router
  .route('/:id')
  .get(catchAsync(campground.showCampground))
  .put(isLoggedIn, isAuthor, catchAsync(campground.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(campground.delete));

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campground.renderEditForm)
);

module.exports = router;
