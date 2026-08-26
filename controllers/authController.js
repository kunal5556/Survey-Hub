const User = require('../models/User');
const { flashFormError } = require('../middleware/validate');

const showRegisterForm = (req, res) => {
  res.render('auth/register', { title: 'Register' });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.validated;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    flashFormError(req, 'An account with this email already exists');
    return res.redirect('/auth/register');
  }

  await User.create({ name, email, password });

  req.flash('success', 'Your account has been created, please log in');
  res.redirect('/auth/login');
};

const showLoginForm = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

const loginUser = async (req, res) => {
  const { email, password } = req.validated;

  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    flashFormError(req, 'Invalid email or password');
    return res.redirect('/auth/login');
  }

  req.session.userId = user._id;

  req.flash('success', `Welcome back, ${user.name}`);
  res.redirect('/surveys');
};

const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};

module.exports = { showRegisterForm, registerUser, showLoginForm, loginUser, logoutUser };
