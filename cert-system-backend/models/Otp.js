const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  expires: { type: Date, required: true },
}, { timestamps: true });

// Optional: Automatically remove expired OTPs
otpSchema.index({ "expires": 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', otpSchema);