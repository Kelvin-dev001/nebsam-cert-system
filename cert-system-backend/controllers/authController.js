const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { sendOtpSms } = require('../utils/sms');

// In-memory OTP store (for demo; switch to Redis or DB for production)
const otpStore = {}; // { email: { otp: '123456', expires: timestamp } }
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

exports.register = async (req, res) => {
  // unchanged
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: role || 'user'
    });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err: err.message });
  }
};

// Step 1: User submits email and password. If correct, send OTP to fixed admin numbers.
exports.loginRequestOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = {
      otp,
      expires: Date.now() + OTP_EXPIRY_MS,
      userId: user._id,
      role: user.role
    };

    // Logging: show OTP store after setting OTP
    console.log('OTP store after loginRequestOtp:', JSON.stringify(otpStore, null, 2));

    // Send OTP via bulk SMS to both fixed numbers
    const smsResult = await sendOtpSms(otp);
    console.log('SMS Result:', smsResult); // Log the result of SMS sending
    if (!smsResult) {
      console.log('SMS sending failed for OTP:', otp);
      return res.status(500).json({ msg: "OTP SMS failed" });
    }

    res.json({ success: true, msg: "OTP sent to admin numbers. Get OTP from admin and enter to log in." });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err: err.message });
  }
};

// Step 2: User submits email and OTP. If correct, return JWT and user data.
// Accepts either the correct OTP or the test OTP '9999'
exports.loginVerifyOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, otp } = req.body;
  try {
    // Logging: show OTP store before verifying OTP
    console.log('OTP store at loginVerifyOtp:', JSON.stringify(otpStore, null, 2));

    const otpRecord = otpStore[email];
    if (!otpRecord) {
      console.log(`No OTP record found for email: ${email}`);
      return res.status(400).json({ msg: "No OTP found. Please login again." });
    }
    if (Date.now() > otpRecord.expires) {
      console.log(`OTP expired for email: ${email}`);
      delete otpStore[email];
      return res.status(400).json({ msg: "OTP expired. Please login again." });
    }
    // Accept either correct OTP or '9999' as a test bypass
    if (otp !== otpRecord.otp && otp !== '9999') {
      console.log(`Invalid OTP entered for email: ${email}. Expected: ${otpRecord.otp}, Received: ${otp}`);
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // Success: issue JWT
    const token = jwt.sign({ id: otpRecord.userId, role: otpRecord.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    // Optionally fetch full user
    const user = await User.findById(otpRecord.userId);
    delete otpStore[email]; // Remove used OTP

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err: err.message });
  }
};

// Legacy login endpoint (for backward compatibility, can be removed later)
exports.login = async (req, res) => {
  // Recommend using loginRequestOtp + loginVerifyOtp flow
  res.status(400).json({ msg: "Please use OTP-based login." });
};