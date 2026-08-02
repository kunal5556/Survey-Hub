const User = require('../models/User');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const showRegisterForm = (req, res) => {
  res.render('auth/register', { title: 'Register' });
};

const registerUser = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect('/auth/register');
  }

  const existingUser = await User.findOne({ email: value.email });
  if (existingUser) {
    req.flash('error', 'An account with this email already exists');
    return res.redirect('/auth/register');
  }

  await User.create({
    name: value.name,
    email: value.email,
    password: value.password
  });

  req.flash('success', 'Your account has been created, please log in');
  res.redirect('/auth/login');
};

const showLoginForm = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

const loginUser = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect('/auth/login');
  }

  const user = await User.findOne({ email: value.email });
  if (!user || !(await user.isPasswordCorrect(value.password))) {
    req.flash('error', 'Invalid email or password');
    return res.redirect('/auth/login');
  }

  req.session.userId = user._id;
  req.flash('success', `Welcome back, ${user.name}`);
  res.redirect('/');
};

const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};

module.exports = { showRegisterForm, registerUser, showLoginForm, loginUser, logoutUser };
