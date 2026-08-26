const express = require('express');
const authController = require('../controllers/authController');
const { isAuthenticated, isGuest } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const router = express.Router();

router.get('/register', isGuest, authController.showRegisterForm);
router.post('/register', isGuest, validate({
  schema: registerSchema,
  redirectTo: () => '/auth/register'
}), authController.registerUser);

router.get('/login', isGuest, authController.showLoginForm);
router.post('/login', isGuest, validate({
  schema: loginSchema,
  redirectTo: () => '/auth/login'
}), authController.loginUser);

router.post('/logout', isAuthenticated, authController.logoutUser);

module.exports = router;
