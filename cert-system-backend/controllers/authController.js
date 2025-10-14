const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult, check } = require('express-validator');
const User = require('../models/User');
const Otp = require('../models/Otp');

// Optional SMS sender (safe to keep; errors are caught and logged)
let sendOtpSms = async () => true;
try {
  // If sms.js is at backend root, this path is correct from controllers/
  const sms = require('../utils/sms');
  if (sms && typeof sms.sendOtpSms === 'function') {
    sendOtpSms = sms.sendOtpSms;
  }
} catch (e) {
  console.warn('[otp] sms module not loaded (this is OK for dev):', e.message);
}

const normalizeEmail = (e) => (e || '').trim().toLowerCase();

// Validators (kept here if you want to use them from routes)
exports.validateRequestOtp = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').isString().notEmpty(),
];

exports.validateVerifyOtp = [
  check('email', 'Please include a valid email').isEmail(),
  check('otp', 'OTP is required and must be 6 digits').isLength({ min: 6, max: 6 }),
];

// POST /api/auth/register
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email: normalizeEmail(email) });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = new User({
      name: name.trim(),
      email: normalizeEmail(email),
      password: hashedPassword,
    });

    await newUser.save();

    // FIX: Create JWT token with { id, role } at root
    const payload = { id: newUser.id, role: newUser.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '12h' });

    // Respond with new user and token
    return res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token
    });
  } catch (err) {
    console.error('[register] error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// POST /api/auth/login/request-otp
exports.loginRequestOtp = async (req, res) => {
  console.log('[route] /login/request-otp hit');
  console.log('[request-otp] body:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.warn('[request-otp] validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const email = normalizeEmail(req.body.email);
  const { password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.warn('[request-otp] user not found:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn('[request-otp] wrong password for:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await Otp.deleteMany({ email }); // single active OTP per email
    const otpDoc = await Otp.create({ email, otp, expires });
    console.log('[request-otp] OTP saved:', { id: otpDoc._id, email, otp, expires });

    // Try sending via SMS (optional). Do not fail login if SMS fails.
    try {
      const smsOk = await sendOtpSms(otp);
      console.log('[request-otp] sms send result:', smsOk);
    } catch (smsErr) {
      console.warn('[request-otp] sms send error:', smsErr?.message || smsErr);
    }

    // In non-production, optionally echo OTP back for easy testing.
    // NEVER enable in production. Set ECHO_OTP=true in Render env only for staging/dev.
    const body = { success: true, msg: 'OTP generated.' };
    if (process.env.ECHO_OTP === 'true') {
      body.debugOtp = otp;
    }

    return res.status(200).json(body);
  } catch (err) {
    console.error('[request-otp] error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// POST /api/auth/login/verify-otp
exports.loginVerifyOtp = async (req, res) => {
  console.log('[route] /login/verify-otp hit');
  console.log('[verify-otp] body:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.warn('[verify-otp] validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp).trim();

  try {
    const otpRecord = await Otp.findOne({ email, otp });
    console.log(
      '[verify-otp] otpRecord:',
      otpRecord ? { id: otpRecord._id, email: otpRecord.email, expires: otpRecord.expires } : null
    );

    if (!otpRecord) {
      return res.status(400).json({ msg: 'No OTP found or OTP is incorrect. Please request a new OTP.' });
    }

    if (Date.now() > new Date(otpRecord.expires).getTime()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      console.warn('[verify-otp] OTP expired for:', email);
      return res.status(400).json({ msg: 'OTP expired. Please request a new OTP.' });
    }

    // OTP is valid; delete for single use
    await Otp.deleteOne({ _id: otpRecord._id });

    // Create token (FIX: Use { id, role } at root)
    const user = await User.findOne({ email });
    if (!user) {
      console.error('[verify-otp] user disappeared for email:', email);
      return res.status(400).json({ msg: 'User not found' });
    }

    const payload = { id: user.id, role: user.role || 'user' };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '12h' });

    console.log('[verify-otp] success for:', email);
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role || 'user',
      },
    });
  } catch (err) {
    console.error('[verify-otp] error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Legacy login endpoint (optional, not implemented)
exports.login = async (req, res) => {
  return res.status(501).json({ msg: 'Login handler not implemented' });
};