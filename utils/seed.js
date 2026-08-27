require('dotenv').config();

const mongoose = require('mongoose');
const connectDatabase = require('../config/database');
const User = require('../models/User');
const Survey = require('../models/Survey');
const Response = require('../models/Response');
const generateShareSlug = require('./slug');

const sampleAccounts = [
  {
    name: 'Site Admin',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: 'admin'
  },
  { name: 'Riya Sharma', email: 'riya@example.com', password: 'riya1234', role: 'user' }
];

const sampleQuestions = [
  {
    text: 'How would you rate the food quality?',
    type: 'single-choice',
    options: ['Excellent', 'Good', 'Average', 'Poor'],
    required: true
  },
  {
    text: 'Which meals do you usually eat in the mess?',
    type: 'multiple-choice',
    options: ['Breakfast', 'Lunch', 'Snacks', 'Dinner'],
    required: false
  },
  {
    text: 'Rate the cleanliness of the dining hall',
    type: 'rating',
    options: [],
    required: true
  },
  {
    text: 'What would you like us to improve?',
    type: 'short-text',
    options: [],
    required: false
  }
];

const sampleAnswers = [
  ['Good', ['Breakfast', 'Dinner'], 4, 'More vegetarian options please'],
  ['Average', ['Lunch'], 3, 'The queue is too long in the evening'],
  ['Excellent', ['Breakfast', 'Lunch', 'Dinner'], 5, ''],
  ['Poor', [], 2, 'Food gets cold before it is served']
];

const removeExistingSampleData = async () => {
  const accounts = await User.find({ email: { $in: sampleAccounts.map((account) => account.email) } });
  const surveys = await Survey.find({ owner: { $in: accounts.map((account) => account._id) } });

  for (const survey of surveys) {
    await survey.deleteOne();
  }

  await User.deleteMany({ _id: { $in: accounts.map((account) => account._id) } });
};

const createSampleResponses = async (survey) => {
  const responses = sampleAnswers.map((answerSet) => ({
    survey: survey._id,
    respondent: null,
    answers: survey.questions.map((question, index) => ({
      question: question._id,
      value: answerSet[index]
    }))
  }));

  await Response.insertMany(responses);
};

const seed = async () => {
  await connectDatabase();
  await removeExistingSampleData();

  const [admin, creator] = await User.create(sampleAccounts);

  const publishedSurvey = await Survey.create({
    title: 'Hostel Mess Feedback',
    description: 'Tell us what you think about the hostel mess so we can improve it.',
    owner: creator._id,
    status: 'published',
    questions: sampleQuestions,
    shareSlug: await generateShareSlug()
  });

  await Survey.create({
    title: 'Library Facilities Survey',
    description: 'A draft survey that is still being prepared.',
    owner: creator._id,
    questions: sampleQuestions.slice(0, 2)
  });

  await createSampleResponses(publishedSurvey);

  console.log('Sample data created');
  console.log(`Admin login: ${admin.email} / ${sampleAccounts[0].password}`);
  console.log(`Creator login: ${creator.email} / ${sampleAccounts[1].password}`);
  console.log(`Public survey link: /s/${publishedSurvey.shareSlug}`);

  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error('Seeding failed:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
