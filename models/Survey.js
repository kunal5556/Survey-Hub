const mongoose = require('mongoose');
const { questionTypes } = require('../utils/questionTypes');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: questionTypes,
    required: true
  },
  options: [{
    type: String,
    trim: true
  }],
  required: {
    type: Boolean,
    default: false
  }
});

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'closed'],
    default: 'draft'
  },
  questions: [questionSchema],
  shareSlug: {
    type: String,
    unique: true,
    sparse: true
  }
}, { timestamps: true });

surveySchema.pre('deleteOne', { document: true, query: false }, async function () {
  await mongoose.model('Response').deleteMany({ survey: this._id });
});

module.exports = mongoose.model('Survey', surveySchema);
