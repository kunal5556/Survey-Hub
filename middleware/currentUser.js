const User = require('../models/User');

const attachCurrentUser = async (req, res, next) => {
  res.locals.currentUser = null;

  if (req.session.userId) {
    res.locals.currentUser = await User.findById(req.session.userId).select('name email role');
  }

  next();
};

module.exports = attachCurrentUser;
