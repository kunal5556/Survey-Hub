const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/register', authController.showRegisterForm);
router.post('/register', authController.registerUser);
router.get('/login', authController.showLoginForm);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

module.exports = router;
