const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campground = require('../controllers/campground');

router
  .route('/')
  .get(catchAsync(campground.index))
  .post(
    isLoggedIn,
    validateCampground,
    upload.array('image'),
    catchAsync(campground.createCampground)
  );

router.get('/new', isLoggedIn, catchAsync(campground.renderNewForm));

router
  .route('/:id')
  .get(catchAsync(campground.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateCampground,
    catchAsync(campground.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campground.delete));

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campground.renderEditForm)
);

module.exports = router;
