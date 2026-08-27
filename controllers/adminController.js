const mongoose = require('mongoose');
const User = require('../models/User');
const Survey = require('../models/Survey');
const Response = require('../models/Response');

const removeSurveys = async (surveys) => {
  for (const survey of surveys) {
    await survey.deleteOne();
  }
};

const showDashboard = async (req, res) => {
  const [totalUsers, totalSurveys, totalResponses] = await Promise.all([
    User.countDocuments(),
    Survey.countDocuments(),
    Response.countDocuments()
  ]);

  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
    totalUsers,
    totalSurveys,
    totalResponses
  });
};

const listUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.render('admin/users', { title: 'All Users', users });
};

const listSurveys = async (req, res) => {
  const surveys = await Survey.find().populate('owner', 'name email').sort({ createdAt: -1 });
  res.render('admin/surveys', { title: 'All Surveys', surveys });
};

const deleteUser = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    req.flash('error', 'That user could not be found');
    return res.redirect('/admin/users');
  }

  if (req.params.id === req.session.userId.toString()) {
    req.flash('error', 'You cannot delete your own admin account');
    return res.redirect('/admin/users');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    req.flash('error', 'That user could not be found');
    return res.redirect('/admin/users');
  }

  await removeSurveys(await Survey.find({ owner: user._id }));
  await user.deleteOne();

  req.flash('success', `${user.name} and all of their surveys have been deleted`);
  res.redirect('/admin/users');
};

const deleteSurvey = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    req.flash('error', 'That survey could not be found');
    return res.redirect('/admin/surveys');
  }

  const survey = await Survey.findById(req.params.id);
  if (!survey) {
    req.flash('error', 'That survey could not be found');
    return res.redirect('/admin/surveys');
  }

  await survey.deleteOne();

  req.flash('success', 'Survey deleted');
  res.redirect('/admin/surveys');
};

module.exports = { showDashboard, listUsers, listSurveys, deleteUser, deleteSurvey };
