const Survey = require('../models/Survey');
const { surveySchema } = require('../validators/surveyValidator');
const { questionTypeLabels } = require('../utils/questionTypes');

const listSurveys = async (req, res) => {
  const surveys = await Survey.find({ owner: req.session.userId }).sort({ createdAt: -1 });
  res.render('surveys/index', { title: 'My Surveys', surveys });
};

const showCreateForm = (req, res) => {
  res.render('surveys/new', { title: 'New Survey' });
};

const createSurvey = async (req, res) => {
  const { error, value } = surveySchema.validate(req.body);
  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect('/surveys/new');
  }

  const survey = await Survey.create({
    title: value.title,
    description: value.description,
    owner: req.session.userId
  });

  req.flash('success', 'Survey created, now add some questions');
  res.redirect(`/surveys/${survey._id}`);
};

const showSurvey = (req, res) => {
  res.render('surveys/show', {
    title: req.survey.title,
    survey: req.survey,
    questionTypeLabels
  });
};

const showEditForm = (req, res) => {
  res.render('surveys/edit', { title: 'Edit Survey', survey: req.survey });
};

const updateSurvey = async (req, res) => {
  const { error, value } = surveySchema.validate(req.body);
  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect(`/surveys/${req.survey._id}/edit`);
  }

  req.survey.title = value.title;
  req.survey.description = value.description;
  await req.survey.save();

  req.flash('success', 'Survey updated');
  res.redirect(`/surveys/${req.survey._id}`);
};

const deleteSurvey = async (req, res) => {
  await req.survey.deleteOne();

  req.flash('success', 'Survey deleted');
  res.redirect('/surveys');
};

module.exports = {
  listSurveys,
  showCreateForm,
  createSurvey,
  showSurvey,
  showEditForm,
  updateSurvey,
  deleteSurvey
};
