const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const Otp = require('../models/Otp');

// @route   POST /api/auth/register
// @desc    Register new user
router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6+ chars').isLength({ min: 6 }),
  ],
  authController.register
);

// @route   POST /api/auth/login/request-otp
// @desc    Step 1: Validate credentials and send OTP to admin numbers
router.post(
  '/login/request-otp',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.loginRequestOtp
);

// @route   POST /api/auth/login/verify-otp
// @desc    Step 2: Verify OTP and log in
router.post(
  '/login/verify-otp',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('otp', 'OTP is required and must be 6 digits').isLength({ min: 6, max: 6 }),
  ],
  authController.loginVerifyOtp
);

// Legacy login endpoint (deprecated)
router.post(
  '/login',
  [check('email', 'Please include a valid email').isEmail(), check('password', 'Password is required').exists()],
  authController.login
);

// Safe debug endpoint (enable with AUTH_DEBUG=true). Never enable in prod.
router.get('/debug/otps', async (req, res) => {
  if (process.env.AUTH_DEBUG !== 'true') return res.status(404).json({ msg: 'Not found' });
  const email = (req.query.email || '').trim().toLowerCase();
  const filter = email ? { email } : {};
  const docs = await Otp.find(filter).sort({ createdAt: -1 }).limit(5).select('-__v');
  res.json({ count: docs.length, docs });
});

module.exports = router;