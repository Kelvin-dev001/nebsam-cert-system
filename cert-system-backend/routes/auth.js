const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register new user
router.post('/register', [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6+ chars').isLength({ min: 6 })
], authController.register);

// @route   POST /api/auth/login/request-otp
// @desc    Step 1: Validate credentials and send OTP to admin numbers
router.post('/login/request-otp', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], authController.loginRequestOtp);

// @route   POST /api/auth/login/verify-otp
// @desc    Step 2: Verify OTP and log in
router.post('/login/verify-otp', [
  check('email', 'Please include a valid email').isEmail(),
  check('otp', 'OTP is required and must be 6 digits').isLength({ min: 6, max: 6 })
], authController.loginVerifyOtp);

// Legacy login endpoint (deprecated)
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], authController.login);

module.exports = router;