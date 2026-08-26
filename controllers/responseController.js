const Survey = require('../models/Survey');
const Response = require('../models/Response');
const { ratingScale } = require('../utils/questionTypes');

const loadPublicSurvey = async (req, res, next) => {
  const survey = await Survey.findOne({ shareSlug: req.params.slug });

  if (!survey || survey.status === 'draft') {
    req.flash('error', 'That survey link is not valid');
    return res.redirect('/');
  }

  req.survey = survey;
  next();
};

const requireOpenSurvey = (req, res, next) => {
  if (req.survey.status !== 'published') {
    req.flash('error', 'This survey is closed and no longer accepts responses');
    return res.redirect(`/s/${req.survey.shareSlug}`);
  }

  next();
};

const showPublicSurvey = (req, res) => {
  res.render('respond/show', {
    title: req.survey.title,
    survey: req.survey,
    ratingScale
  });
};

const submitResponse = async (req, res) => {
  const answers = req.survey.questions.map((question) => ({
    question: question._id,
    value: req.validated[question._id.toString()]
  }));

  await Response.create({
    survey: req.survey._id,
    respondent: req.session.userId || null,
    answers
  });

  res.redirect(`/s/${req.survey.shareSlug}/thank-you`);
};

const showThankYou = (req, res) => {
  res.render('respond/thankyou', { title: 'Thank You', survey: req.survey });
};

module.exports = { loadPublicSurvey, requireOpenSurvey, showPublicSurvey, submitResponse, showThankYou };
