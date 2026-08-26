const rememberInput = (body) => {
  const input = Object.assign({}, body);
  delete input.password;
  delete input.confirmPassword;
  return input;
};

const flashFormError = (req, message) => {
  req.flash('error', message);
  req.flash('formInput', rememberInput(req.body));
};

const validate = (options) => (req, res, next) => {
  const schema = typeof options.schema === 'function' ? options.schema(req) : options.schema;
  const data = options.data ? options.data(req) : req.body;

  const { error, value } = schema.validate(data);

  if (error) {
    flashFormError(req, error.details[0].message);
    return res.redirect(options.redirectTo(req));
  }

  req.validated = value;
  next();
};

module.exports = { validate, flashFormError };
