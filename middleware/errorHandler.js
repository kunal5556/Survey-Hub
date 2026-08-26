const AppError = require('../utils/AppError');

const notFound = (req, res, next) => {
  next(new AppError('The page you are looking for does not exist', 404));
};

const errorHandler = (error, req, res, next) => {
  res.locals.currentUser = res.locals.currentUser || null;
  res.locals.success = res.locals.success || [];
  res.locals.error = res.locals.error || [];

  if (error.statusCode === 404) {
    return res.status(404).render('errors/404', { title: 'Page Not Found', message: error.message });
  }

  console.error(error);
  res.status(500).render('errors/500', { title: 'Server Error' });
};

module.exports = { notFound, errorHandler };
