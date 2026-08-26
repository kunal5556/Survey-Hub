const Joi = require('joi');
const { ratingScale } = require('../utils/questionTypes');

const buildAnswerSchema = (question) => {
  if (question.type === 'multiple-choice') {
    const answer = Joi.array().items(Joi.string().valid(...question.options)).single();
    return question.required ? answer.min(1).required() : answer.default([]);
  }

  if (question.type === 'single-choice') {
    const answer = Joi.string().valid(...question.options);
    return question.required ? answer.required() : answer.allow('').default('');
  }

  if (question.type === 'rating') {
    const answer = Joi.number().integer().min(ratingScale[0]).max(ratingScale[ratingScale.length - 1]);
    return question.required ? answer.required() : answer.allow('').default('');
  }

  const answer = Joi.string().trim().max(1000);
  return question.required ? answer.required() : answer.allow('').default('');
};

const buildResponseSchema = (questions) => {
  const answerShape = {};

  questions.forEach((question) => {
    answerShape[question._id.toString()] = buildAnswerSchema(question).label(question.text);
  });

  return Joi.object(answerShape);
};

module.exports = { buildResponseSchema };
