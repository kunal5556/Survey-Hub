const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().label('Name'),
  email: Joi.string().trim().email().required().label('Email'),
  password: Joi.string().min(6).max(50).required().label('Password'),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().label('Confirm password')
    .messages({ 'any.only': 'Both passwords must match' })
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().label('Email'),
  password: Joi.string().required().label('Password')
});

module.exports = { registerSchema, loginSchema };
