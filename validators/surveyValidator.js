const Joi = require('joi');
const { questionTypes, choiceQuestionTypes } = require('../utils/questionTypes');

const surveySchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required().label('Title'),
  description: Joi.string().trim().max(1000).allow('').default('').label('Description')
});

const questionSchema = Joi.object({
  text: Joi.string().trim().min(3).max(300).required().label('Question'),
  type: Joi.string().valid(...questionTypes).required().label('Question type'),
  options: Joi.when('type', {
    is: Joi.valid(...choiceQuestionTypes),
    then: Joi.array().items(Joi.string().trim().min(1).max(200)).min(2).required(),
    otherwise: Joi.array().default([])
  }).label('Options'),
  required: Joi.boolean().default(false).label('Required')
});

module.exports = { surveySchema, questionSchema };
