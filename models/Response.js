const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed
  }
}, { _id: false });

const responseSchema = new mongoose.Schema({
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  respondent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  answers: [answerSchema]
}, { timestamps: true });

module.exports = mongoose.model('Response', responseSchema);
