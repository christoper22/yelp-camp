const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
  res.render('users/register');
};

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'welcome to yelp camp');
      res.redirect('/campgrounds');
    });
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/register');
  }
};

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
};

module.exports.login = async (req, res) => {
  req.flash('success', 'welcome back');
  // console.log('sadad', req.newPath);
  const redirectUrl = (await req.newPath) || '/campgrounds';

  res.redirect(redirectUrl);
};

module.exports.logout = async (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash('success', 'goodbye');
  res.redirect('/campgrounds');
};
