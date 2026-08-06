const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    req.flash('error', 'Please log in to continue');
    return res.redirect('/auth/login');
  }

  next();
};

const isGuest = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/');
  }

  next();
};

module.exports = { isAuthenticated, isGuest };
