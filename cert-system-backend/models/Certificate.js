const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['tracking', 'radio'],
      required: true,
    },
    certificateSerialNo: { type: String, required: true, unique: true },
    issuedTo: { type: String, required: true },
    dateOfIssue: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Tracking certificate fields
    vehicleRegNumber: String,
    make: String,
    bodyType: String,
    chassisNumber: String,
    deviceFittedWith: String,
    imeiNo: String,
    simNo: String,
    dateOfInstallation: Date,
    expiryDate: Date,
    idNumber: String,
    phoneNumber: String,

    // Radio call certificate fields
    companyName: String,
    radioLicenseNumber: String,
    deviceId: String,
    model: String,
    cakNumber: String,

    // Approval fields
    approved: { type: Boolean, default: false },
    approvedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);