const Survey = require('../models/Survey');
const Response = require('../models/Response');
const { questionTypeLabels } = require('../utils/questionTypes');
const { buildSurveyResults, buildChartData } = require('../utils/aggregate');
const generateShareSlug = require('../utils/slug');

const buildShareUrl = (req, survey) => {
  if (!survey.shareSlug) {
    return null;
  }

  return `${req.protocol}://${req.get('host')}/s/${survey.shareSlug}`;
};

const changeSurveyStatus = async (req, res, transition) => {
  if (req.survey.status !== transition.from) {
    req.flash('error', transition.rejectedMessage);
    return res.redirect(`/surveys/${req.survey._id}`);
  }

  req.survey.status = transition.to;
  await req.survey.save();

  req.flash('success', transition.successMessage);
  res.redirect(`/surveys/${req.survey._id}`);
};

const listSurveys = async (req, res) => {
  const surveys = await Survey.find({ owner: req.session.userId }).sort({ createdAt: -1 });
  res.render('surveys/index', { title: 'My Surveys', surveys });
};

const showCreateForm = (req, res) => {
  res.render('surveys/new', { title: 'New Survey' });
};

const createSurvey = async (req, res) => {
  const survey = await Survey.create({
    title: req.validated.title,
    description: req.validated.description,
    owner: req.session.userId
  });

  req.flash('success', 'Survey created, now add some questions');
  res.redirect(`/surveys/${survey._id}`);
};

const showSurvey = (req, res) => {
  res.render('surveys/show', {
    title: req.survey.title,
    survey: req.survey,
    questionTypeLabels,
    shareUrl: buildShareUrl(req, req.survey)
  });
};

const showEditForm = (req, res) => {
  res.render('surveys/edit', { title: 'Edit Survey', survey: req.survey });
};

const updateSurvey = async (req, res) => {
  req.survey.title = req.validated.title;
  req.survey.description = req.validated.description;
  await req.survey.save();

  req.flash('success', 'Survey updated');
  res.redirect(`/surveys/${req.survey._id}`);
};

const deleteSurvey = async (req, res) => {
  await req.survey.deleteOne();

  req.flash('success', 'Survey deleted');
  res.redirect('/surveys');
};

const publishSurvey = async (req, res) => {
  const survey = req.survey;

  if (survey.status !== 'draft') {
    req.flash('error', 'Only a draft survey can be published');
    return res.redirect(`/surveys/${survey._id}`);
  }

  if (survey.questions.length === 0) {
    req.flash('error', 'Add at least one question before publishing');
    return res.redirect(`/surveys/${survey._id}`);
  }

  if (!survey.shareSlug) {
    survey.shareSlug = await generateShareSlug();
  }

  survey.status = 'published';
  await survey.save();

  req.flash('success', 'Survey published, share the link to start collecting responses');
  res.redirect(`/surveys/${survey._id}`);
};

const closeSurvey = (req, res) => changeSurveyStatus(req, res, {
  from: 'published',
  to: 'closed',
  rejectedMessage: 'Only a published survey can be closed',
  successMessage: 'Survey closed, it will not accept new responses'
});

const reopenSurvey = (req, res) => changeSurveyStatus(req, res, {
  from: 'closed',
  to: 'published',
  rejectedMessage: 'Only a closed survey can be reopened',
  successMessage: 'Survey reopened and accepting responses again'
});

const showResults = async (req, res) => {
  const responses = await Response.find({ survey: req.survey._id }).sort({ createdAt: -1 });
  const results = buildSurveyResults(req.survey, responses);

  res.render('surveys/results', {
    title: `Results: ${req.survey.title}`,
    survey: req.survey,
    results,
    chartData: buildChartData(results),
    questionTypeLabels
  });
};

module.exports = {
  listSurveys,
  showCreateForm,
  createSurvey,
  showSurvey,
  showEditForm,
  updateSurvey,
  deleteSurvey,
  publishSurvey,
  closeSurvey,
  reopenSurvey,
  showResults
};
