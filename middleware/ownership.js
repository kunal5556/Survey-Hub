const mongoose = require('mongoose');
const Survey = require('../models/Survey');

const loadOwnedSurvey = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    req.flash('error', 'That survey could not be found');
    return res.redirect('/surveys');
  }

  const survey = await Survey.findById(req.params.id);

  if (!survey || !survey.owner.equals(req.session.userId)) {
    req.flash('error', 'That survey could not be found');
    return res.redirect('/surveys');
  }

  req.survey = survey;
  next();
};

module.exports = loadOwnedSurvey;
