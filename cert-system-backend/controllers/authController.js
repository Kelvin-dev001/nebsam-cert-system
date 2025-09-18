const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { sendOtpSms } = require('../utils/sms');

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

exports.register = async (req, res) => {
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
    const expires = new Date(Date.now() + OTP_EXPIRY_MS);

    // Remove any previous OTPs for this email
    await Otp.deleteMany({ email });

    // Save new OTP in MongoDB
    await Otp.create({
      email,
      otp,
      expires,
    });

    // Logging: show OTP in logs (for debugging)
    console.log(`OTP generated for ${email}: ${otp}, expires at ${expires}`);

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
exports.loginVerifyOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, otp } = req.body;
  try {
    // Find matching OTP record in DB
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      console.log(`No OTP record found for email: ${email} and otp: ${otp}`);
      return res.status(400).json({ msg: "No OTP found or OTP is incorrect. Please login again." });
    }
    if (Date.now() > otpRecord.expires.getTime()) {
      console.log(`OTP expired for email: ${email}`);
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ msg: "OTP expired. Please login again." });
    }

    // Success: issue JWT
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found." });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Remove used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

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
  res.status(400).json({ msg: "Please use OTP-based login." });
};