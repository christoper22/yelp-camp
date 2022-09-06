const Campground = require('../models/campground');

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  // if (!req.body.campground) { throw new ExpressError('invalid campground data', 400) }
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'succesfully made a new campground');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('author');
  console.log(campground);
  if (!campground) {
    req.flash('error', 'cannot find that campground');
    return res.redirect('/campgrounds');
  }
  // console.log(campground);
  res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  console.log(campground);
  if (!campground) {
    req.flash('error', 'cannot find that campground');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;

  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash('success', 'succesfully update campground');
  res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.delete = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findOneAndDelete(id);
  req.flash('success', 'succesfully delete campground');
  res.redirect('/campgrounds');
};
