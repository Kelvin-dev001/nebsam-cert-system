const Certificate = require('../models/Certificate');
const { validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');
const { sendOtpSms } = require('../utils/sms');

// Utility to auto-generate serial number with prefix NDS-
async function generateSerialNo() {
  const count = await Certificate.countDocuments();
  return `NDS-${(count + 1).toString().padStart(5, '0')}`;
}

// In-memory OTP store for approvals. Use Redis/DB in production.
const approvalOtpStore = {}; // { certId: { otp: '123456', expires: timestamp } }
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

exports.createCertificate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const certificateSerialNo = await generateSerialNo();
    const data = {
      ...req.body,
      certificateSerialNo,
      createdBy: req.user.id,
      dateOfIssue: new Date()
    };
    if (data.type === 'radio' && !data.cakNumber) {
      data.cakNumber = '1234567890';
    }
    const cert = new Certificate(data);
    await cert.save();
    console.log(`[CREATE CERT] CertID: ${cert._id}, SerialNo: ${certificateSerialNo}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
    res.status(201).json(cert);
  } catch (err) {
    console.error(`[CREATE CERT ERROR] UserID: ${req.user.id}, Time: ${new Date().toISOString()}, Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getCertificates = async (req, res) => {
  const { type, customer, serial, from, to, createdBy } = req.query;
  let filter = {};

  if (type) filter.type = type;
  if (customer) filter.issuedTo = new RegExp(customer, 'i');
  if (serial) filter.certificateSerialNo = serial;
  if (from || to) {
    filter.dateOfIssue = {};
    if (from) filter.dateOfIssue.$gte = new Date(from);
    if (to) filter.dateOfIssue.$lte = new Date(to);
  }
  if (req.user.role === 'admin' && createdBy) filter.createdBy = createdBy;
  if (req.user.role !== 'admin') filter.createdBy = req.user.id;

  try {
    const certs = await Certificate.find(filter).sort({ dateOfIssue: -1 });
    console.log(`[GET CERTS] UserID: ${req.user.id}, Filter: ${JSON.stringify(filter)}, Time: ${new Date().toISOString()}`);
    res.json(certs);
  } catch (err) {
    console.error(`[GET CERTS ERROR] UserID: ${req.user.id}, Time: ${new Date().toISOString()}, Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getCertificateById = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      console.warn(`[GET CERT BY ID] CertID: ${req.params.id} not found, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(404).json({ msg: 'Certificate not found' });
    }
    if (req.user.role !== "admin" && String(cert.createdBy) !== String(req.user.id)) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    res.json(cert);
  } catch (err) {
    console.error(`[GET CERT BY ID ERROR] CertID: ${req.params.id}, UserID: ${req.user.id}, Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.updateCertificate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      console.warn(`[UPDATE CERT] CertID: ${req.params.id} not found, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(404).json({ msg: "Certificate not found" });
    }
    if (req.user.role !== "admin" && String(cert.createdBy) !== req.user.id) {
      console.warn(`[UPDATE CERT UNAUTH] CertID: ${cert._id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(403).json({ msg: "Not authorized" });
    }
    Object.assign(cert, req.body);
    await cert.save();
    console.log(`[UPDATE CERT] CertID: ${cert._id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
    res.json(cert);
  } catch (err) {
    console.error(`[UPDATE CERT ERROR] CertID: ${req.params.id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}, Error: ${err.message}`);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      console.warn(`[DELETE CERT] CertID: ${req.params.id} not found, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(404).json({ msg: "Certificate not found" });
    }
    if (req.user.role !== "admin" && String(cert.createdBy) !== req.user.id) {
      console.warn(`[DELETE CERT UNAUTH] CertID: ${cert._id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(403).json({ msg: "Not authorized" });
    }
    await Certificate.deleteOne({ _id: cert._id });
    console.log(`[DELETE CERT] CertID: ${cert._id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
    res.json({ msg: "Certificate deleted" });
  } catch (err) {
    console.error(`[DELETE CERT ERROR] CertID: ${req.params.id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}, Error: ${err.message}`);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.emailCertificate = async (req, res) => {
  console.log(`[EMAIL CERT] CertID: ${req.params.id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
  res.json({ msg: "Certificate sent by email (stub implementation)" });
};

exports.whatsappCertificate = async (req, res) => {
  console.log(`[WHATSAPP CERT] CertID: ${req.params.id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
  res.json({ msg: "Certificate shared via WhatsApp (stub implementation)" });
};

// Approve certificate: send OTP to admin numbers
exports.sendApprovalOtp = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      console.warn(`[APPROVAL OTP] CertID: ${req.params.id} not found, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(404).json({ msg: "Certificate not found" });
    }
    if (cert.approved) {
      console.warn(`[APPROVAL OTP] CertID: ${cert._id} already approved, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(400).json({ msg: "Already approved." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    approvalOtpStore[cert._id] = {
      otp,
      expires: Date.now() + OTP_EXPIRY_MS
    };

    const smsResult = await sendOtpSms(otp);
    if (!smsResult) {
      console.error(`[APPROVAL OTP ERROR] CertID: ${cert._id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}, SMS sending failed`);
      return res.status(500).json({ msg: "OTP SMS failed" });
    }

    console.log(`[APPROVAL OTP] CertID: ${cert._id}, OTP: ${otp}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
    return res.json({ success: true, msg: "Approval OTP sent to admin numbers." });
  } catch (err) {
    console.error(`[APPROVAL OTP ERROR] CertID: ${req.params.id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}, Error: ${err.message}`);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Verify OTP and mark as approved
exports.verifyApprovalOtp = async (req, res) => {
  const { otp } = req.body;
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      console.warn(`[VERIFY OTP] CertID: ${req.params.id} not found, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(404).json({ msg: "Certificate not found" });
    }
    if (cert.approved) {
      console.warn(`[VERIFY OTP] CertID: ${cert._id} already approved, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(400).json({ msg: "Already approved." });
    }

    const store = approvalOtpStore[cert._id];
    if (!store) {
      console.warn(`[VERIFY OTP] No OTP sent for CertID: ${cert._id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(400).json({ msg: "No OTP sent. Please request approval." });
    }
    if (Date.now() > store.expires) {
      delete approvalOtpStore[cert._id];
      console.warn(`[VERIFY OTP] OTP expired for CertID: ${cert._id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(400).json({ msg: "OTP expired. Please request again." });
    }
    if (otp !== store.otp) {
      console.warn(`[VERIFY OTP] Invalid OTP for CertID: ${cert._id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(400).json({ msg: "Invalid OTP." });
    }

    cert.approved = true;
    cert.approvedAt = new Date();
    await cert.save();
    delete approvalOtpStore[cert._id];

    console.log(`[VERIFY OTP SUCCESS] CertID: ${cert._id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
    res.json({ success: true, msg: "Certificate approved.", cert });
  } catch (err) {
    console.error(`[VERIFY OTP ERROR] CertID: ${req.params.id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}, Error: ${err.message}`);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Share/Print: only allowed if approved
exports.shareCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      console.warn(`[CERT PRINT] CertID: ${req.params.id} not found, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(404).json({ msg: "Certificate not found" });
    }
    if (req.user.role !== "admin" && String(cert.createdBy) !== req.user.id) {
      console.warn(`[CERT PRINT UNAUTH] CertID: ${cert._id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(403).json({ msg: "Not authorized" });
    }
    if (!cert.approved) {
      console.warn(`[CERT PRINT] CertID: ${cert._id} not approved, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(403).json({ msg: "Certificate not approved. Please complete approval before printing." });
    }

    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="certificate_${cert.certificateSerialNo}.pdf"`);
      res.send(pdfData);
    });

    // PDF Content
    doc.fontSize(20).text("Certificate", { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Type: ${cert.type === "tracking" ? "Vehicle Tracking Installation" : "Radio Call Ownership"}`);
    doc.text(`Certificate Serial No: ${cert.certificateSerialNo}`);
    doc.text(`Issued To: ${cert.issuedTo}`);
    doc.text(`Date of Issue: ${cert.dateOfIssue?.toISOString().slice(0,10)}`);
    doc.text(`Approved: ${cert.approved ? 'Yes' : 'No'}`);
    if (cert.approvedAt) doc.text(`Approved At: ${cert.approvedAt.toISOString().slice(0, 19).replace('T', ' ')}`);

    // *** REMOVED CREATED BY LINE ***
    // No doc.text for createdBy!

    if (cert.type === "tracking") {
      doc.moveDown();
      doc.fontSize(14).text(`Vehicle Reg Number: ${cert.vehicleRegNumber}`);
      doc.text(`Make: ${cert.make}`);
      doc.text(`Body Type: ${cert.bodyType}`);
      doc.text(`Chassis Number: ${cert.chassisNumber}`);
      doc.text(`Device Fitted With: ${cert.deviceFittedWith}`);
      doc.text(`IMEI No: ${cert.imeiNo}`);
      doc.text(`SIM No: ${cert.simNo}`);
      doc.text(`Date of Installation: ${cert.dateOfInstallation?.toISOString().slice(0,10)}`);
      doc.text(`Expiry Date: ${cert.expiryDate?.toISOString().slice(0,10)}`);
      doc.text(`ID Number: ${cert.idNumber}`);
      doc.text(`Phone Number: ${cert.phoneNumber}`);
    }
    if (cert.type === "radio") {
      doc.moveDown();
      doc.fontSize(14).text(`Company Name: ${cert.companyName}`);
      doc.text(`Radio License Number: ${cert.radioLicenseNumber}`);
      doc.text(`Device ID: ${cert.deviceId}`);
      doc.text(`Model: ${cert.model}`);
      doc.text(`CAK Number: ${cert.cakNumber}`);
    }

    doc.end();
    console.log(`[CERT PRINT SUCCESS] CertID: ${cert._id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
  } catch (err) {
    console.error(`[CERT PRINT ERROR] CertID: ${req.params.id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}, Error: ${err.message}`);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
// POST /api/auth/register
exports.register = async (req, res) => {
  // Implement registration logic here, or placeholder:
  return res.status(501).json({ msg: 'Not implemented' });
};

// POST /api/auth/login
exports.login = async (req, res) => {
  // Implement legacy login logic here, or placeholder:
  return res.status(501).json({ msg: 'Not implemented' });
};
// POST /api/auth/register
exports.register = async (req, res) => {
  return res.status(501).json({ msg: 'Register handler not implemented' });
};

// Legacy login endpoint
exports.login = async (req, res) => {
  return res.status(501).json({ msg: 'Login handler not implemented' });
};