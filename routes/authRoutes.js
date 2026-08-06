const express = require('express');
const authController = require('../controllers/authController');
const { isAuthenticated, isGuest } = require('../middleware/auth');

const router = express.Router();

router.get('/register', isGuest, authController.showRegisterForm);
router.post('/register', isGuest, authController.registerUser);
router.get('/login', isGuest, authController.showLoginForm);
router.post('/login', isGuest, authController.loginUser);
router.post('/logout', isAuthenticated, authController.logoutUser);

module.exports = router;
