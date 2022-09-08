const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground');

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  // console.log('campground', campground);
  req.flash('success', 'succesfully made a new campground');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('author');
  // console.log(campground);
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
  // console.log(campground);
  if (!campground) {
    req.flash('error', 'cannot find that campground');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  // console.log('update', req.body);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();
  // console.log('deleteImages', req.body.deleteImages);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: {
        images: { filename: { $in: req.body.deleteImages } },
      },
    });
  }
  // console.log('update', campground);
  req.flash('success', 'succesfully update campground');
  res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.delete = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findOneAndDelete(id);
  req.flash('success', 'succesfully delete campground');
  res.redirect('/campgrounds');
};
