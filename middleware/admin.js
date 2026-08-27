const isAdmin = (req, res, next) => {
  if (!res.locals.currentUser || res.locals.currentUser.role !== 'admin') {
    req.flash('error', 'You do not have permission to open that page');
    return res.redirect('/');
  }

  next();
};

module.exports = isAdmin;
