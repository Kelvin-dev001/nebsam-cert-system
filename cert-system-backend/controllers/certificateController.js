const Certificate = require('../models/Certificate');
const { validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');
const path = require('path');
const { sendOtpSms } = require('../utils/sms');

// Utility to auto-generate serial number with prefix NDS-
async function generateSerialNo() {
  const count = await Certificate.countDocuments();
  return `NDS-${(count + 1).toString().padStart(5, '0')}`;
}

// --- Removed approval OTP logic and approval checks ---

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
      console.warn(`[GET CERT BY ID UNAUTH] CertID: ${cert._id}, createdBy: ${cert.createdBy}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
      return res.status(403).json({ msg: "Not authorized" });
    }
    console.log(`[GET CERT BY ID] CertID: ${cert._id}, createdBy: ${cert.createdBy}, UserID: ${req.user.id}, role: ${req.user.role}, Time: ${new Date().toISOString()}`);
    res.json(cert);
  } catch (err) {
    console.error(`[GET CERT BY ID ERROR] CertID: ${req.params.id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}, Error: ${err.message}`);
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

// --- REMOVED approval OTP routes and logic ---

// Share/Print: no approval required
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

    const doc = new PDFDocument({ size: 'A4', margin: 0 });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="certificate_${cert.certificateSerialNo}.pdf"`);
      res.send(pdfData);
    });

    const templatePath = process.env.CERT_TEMPLATE_PATH ||
      path.join(__dirname, '../../frontend/public/certificate-template.png');
    const format = d => (d ? d.toISOString().slice(0, 10) : '');

    // Draw full-page background template
    try {
      doc.image(templatePath, 0, 0, { width: 595.28, height: 841.89 });
    } catch (imgErr) {
      console.warn(`[CERT PRINT] Template image not found at ${templatePath}, rendering without background.`);
    }

    // Overlay dynamic values at mapped coordinates (same as frontend)
    doc.font('Helvetica').fontSize(10).fillColor('#111111');

    const isTracking = cert.type === 'tracking';

    // Certificate Details
    doc.text(isTracking ? 'Vehicle Tracking Installation' : 'Radio Call Ownership', 62, 295);
    doc.text(cert.certificateSerialNo || '', 62, 348);
    doc.text(format(cert.dateOfIssue), 62, 393);

    // Owner Details
    doc.text(cert.issuedTo || '', 62, 478);
    doc.text(cert.idNumber || '', 62, 517);
    doc.text(cert.phoneNumber || '', 62, 555);

    if (isTracking) {
      // Vehicle Details — left column
      doc.text(cert.vehicleRegNumber || '', 145, 635);
      doc.text(cert.make || '', 62, 665);
      doc.text(cert.bodyType || '', 130, 695);

      // Vehicle Details — right column
      doc.text(cert.deviceFittedWith || '', 355, 635);
      doc.text(cert.imeiNo || '', 388, 668);
      doc.text(cert.simNo || '', 388, 695);
      doc.text(format(cert.dateOfInstallation), 415, 722);
      doc.text(format(cert.expiryDate), 415, 748);
    }

    // Bottom — Fitted By (hardcoded)
    doc.text('Dennis Karani', 100, 778);

    doc.end();
    console.log(`[CERT PRINT SUCCESS] CertID: ${cert._id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}`);
  } catch (err) {
    console.error(`[CERT PRINT ERROR] CertID: ${req.params.id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}, Error: ${err.message}`);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// --- Approval endpoints removed ---

// POST /api/auth/register
exports.register = async (req, res) => {
  return res.status(501).json({ msg: 'Not implemented' });
};

// POST /api/auth/login
exports.login = async (req, res) => {
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