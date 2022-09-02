const isLoggedIn = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = await req.originalUrl;
    // console.log('path', req.originalUrl);
    req.flash('error', 'you must be sign in');
    return res.redirect('/login');
  }
  next();
};

module.exports = { isLoggedIn };
