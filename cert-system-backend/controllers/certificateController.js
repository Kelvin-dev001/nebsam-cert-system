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
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ msg: "Certificate not found" });
    }
    if (req.user.role !== "admin" && String(cert.createdBy) !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const { phone } = req.body;
    const rawPhone = (phone || cert.phoneNumber || "").replace(/[^0-9]/g, "");
    const fmt = d => (d ? new Date(d).toISOString().slice(0, 10) : "—");

    const verificationUrl = `${process.env.FRONTEND_URL || "https://nebsamdigital.com"}/certificates/${cert._id}/preview`;

    const lines = [
      "*NEBSAM Certificate of Installation*",
      "━━━━━━━━━━━━━━━━━━━━━━━",
      `📋 Serial No: ${cert.certificateSerialNo || "—"}`,
      `👤 Issued To: ${cert.issuedTo || "—"}`,
      `📅 Date of Issue: ${fmt(cert.dateOfIssue)}`,
    ];

    if (cert.type === "tracking") {
      lines.push(`🚗 Vehicle Reg: ${cert.vehicleRegNumber || "—"}`);
      lines.push(`🔧 Device: ${cert.deviceFittedWith || "—"}`);
      lines.push(`📅 Installation: ${fmt(cert.dateOfInstallation)}`);
      lines.push(`⚠️  Expiry: ${fmt(cert.expiryDate)}`);
    }

    lines.push("━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push(`🔗 View Certificate: ${verificationUrl}`);

    const message = lines.join("\n");
    const waUrl = rawPhone
      ? `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    console.log(`[WHATSAPP CERT] CertID: ${cert._id}, UserID: ${req.user.id}, Phone: ${rawPhone}, Time: ${new Date().toISOString()}`);
    res.json({ waUrl, message });
  } catch (err) {
    console.error(`[WHATSAPP CERT ERROR] CertID: ${req.params.id}, UserID: ${req.user.id}, Time: ${new Date().toISOString()}, Error: ${err.message}`);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
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

    // ── Design tokens ─────────────────────────────────────────────────────
    const NAVY = '#1B2A4A';
    const GOLD = '#C5962A';
    const PAGE_W = 595.28;
    const MARGIN = 20;
    const CONTENT_W = PAGE_W - MARGIN * 2;

    // ── Register custom fonts ─────────────────────────────────────────────
    const fontsDir = path.join(__dirname, '../../frontend/public/fonts/');
    let loraFont = 'Helvetica';
    let loraBoldFont = 'Helvetica-Bold';
    let robotoFont = 'Helvetica';
    try {
      doc.registerFont('Lora', path.join(fontsDir, 'Lora-Regular.ttf'));
      doc.registerFont('Lora-Bold', path.join(fontsDir, 'Lora-Bold.ttf'));
      doc.registerFont('Roboto', path.join(fontsDir, 'Roboto-Regular.ttf'));
      loraFont = 'Lora';
      loraBoldFont = 'Lora-Bold';
      robotoFont = 'Roboto';
    } catch (fontErr) {
      console.warn('[CERT PRINT] Custom fonts unavailable, using Helvetica fallback.');
    }

    const fmt = d => (d ? d.toISOString().slice(0, 10) : '\u2014');
    const isTracking = cert.type === 'tracking';
    let y = 0;

    // ── HEADER (navy banner) ──────────────────────────────────────────────
    doc.rect(0, 0, PAGE_W, 88).fill(NAVY);

    // Logo
    const logoPath = path.join(__dirname, '../../frontend/public/nebsam_logo.png');
    try {
      doc.image(logoPath, 60, 14, { height: 58 });
    } catch (e) { /* logo missing — skip */ }

    // Brand name
    doc.font(loraBoldFont).fontSize(26).fillColor('#FFFFFF')
       .text('NEBSAM', 0, 22, { width: PAGE_W, align: 'center', characterSpacing: 3 });

    // Tagline
    doc.font(robotoFont).fontSize(9).fillColor(GOLD)
       .text('Smart Tracking & Telematics Solutions', 0, 56, { width: PAGE_W, align: 'center', characterSpacing: 1 });

    y = 88;

    // ── GOLD LINE ─────────────────────────────────────────────────────────
    doc.rect(0, y, PAGE_W, 3).fill(GOLD);
    y += 3;

    // ── TITLE SECTION ─────────────────────────────────────────────────────
    doc.rect(0, y, PAGE_W, 56).fill('#FAFAF6');

    doc.font(loraBoldFont).fontSize(22).fillColor(NAVY)
       .text('Certificate of Installation', 0, y + 12, { width: PAGE_W, align: 'center', characterSpacing: 1 });

    doc.font(robotoFont).fontSize(13).fillColor(GOLD)
       .text('\u25C6  \u25C6  \u25C6', 0, y + 38, { width: PAGE_W, align: 'center', characterSpacing: 8 });

    y += 56;

    // ── GOLD LINE ─────────────────────────────────────────────────────────
    doc.rect(0, y, PAGE_W, 3).fill(GOLD);
    y += 3;

    // ── HELPER: draw section header bar ───────────────────────────────────
    const drawSectionBar = (title, yPos) => {
      doc.rect(MARGIN, yPos, CONTENT_W, 22).fill(NAVY);
      doc.font(loraBoldFont).fontSize(10).fillColor('#FFFFFF')
         .text(`\u25C6  ${title}  \u25C6`, MARGIN, yPos + 6, { width: CONTENT_W, align: 'center' });
      return yPos + 22;
    };

    // ── HELPER: draw bordered section box outline ──────────────────────────
    const drawSectionBoxBorder = (yTop, height) => {
      doc.rect(MARGIN, yTop, CONTENT_W, height).stroke(NAVY);
    };

    // ── HELPER: draw a label: value row ───────────────────────────────────
    const drawFieldRow = (label, value, xOffset, yPos, bold) => {
      const LABEL_W = 85;
      doc.font(loraBoldFont).fontSize(8.5).fillColor(NAVY)
         .text(`${label}:`, xOffset, yPos, { width: LABEL_W, lineBreak: false });
      if (bold) {
        doc.font(loraBoldFont).fontSize(9).fillColor(NAVY)
           .text(value || '\u2014', xOffset + LABEL_W + 4, yPos, { width: 140, lineBreak: false });
      } else {
        doc.font(robotoFont).fontSize(8.5).fillColor('#333')
           .text(value || '\u2014', xOffset + LABEL_W + 4, yPos, { width: 140, lineBreak: false });
      }
      return yPos + 14;
    };

    // ── CERTIFICATE DETAILS SECTION ───────────────────────────────────────
    y += 8; // top margin
    y = drawSectionBar('Certificate Details', y);
    const certBoxTop = y;
    const certBoxPad = 10;
    const leftColX = MARGIN + certBoxPad;
    const rightColX = MARGIN + CONTENT_W / 2 + certBoxPad;

    let leftY = y + certBoxPad;
    let rightY = y + certBoxPad;

    // Left column
    leftY = drawFieldRow('Type', isTracking ? 'Vehicle Tracking Installation' : 'Radio Call Ownership', leftColX, leftY);
    // Serial number with box
    doc.font(loraBoldFont).fontSize(8.5).fillColor(NAVY)
       .text('Serial No:', leftColX, leftY, { lineBreak: false });
    const serialVal = cert.certificateSerialNo || '\u2014';
    const snBoxX = leftColX + 89;
    const snBoxW = 90;
    doc.rect(snBoxX, leftY - 1, snBoxW, 15).stroke(NAVY);
    doc.font(loraBoldFont).fontSize(10).fillColor(NAVY)
       .text(serialVal, snBoxX + 4, leftY + 1, { width: snBoxW - 8, lineBreak: false });
    leftY += 18;
    leftY = drawFieldRow('Date of Issue', fmt(cert.dateOfIssue), leftColX, leftY);

    // Right column — company info
    doc.font(loraBoldFont).fontSize(9).fillColor(NAVY)
       .text('Nebsam Digital Solutions (K) Ltd', rightColX, rightY, { width: CONTENT_W / 2 - certBoxPad * 2 });
    rightY += 14;
    doc.font(robotoFont).fontSize(7.5).fillColor('#555')
       .text('P.O. Box 62330-00619 Nairobi | RG-8372897', rightColX, rightY, { width: CONTENT_W / 2 - certBoxPad * 2, lineBreak: false });
    rightY += 12;
    doc.font(robotoFont).fontSize(7.5).fillColor('#555')
       .text('info@nebsam.co.ke | www.nebsam.co.ke', rightColX, rightY, { width: CONTENT_W / 2 - certBoxPad * 2, lineBreak: false });
    rightY += 12;

    const certBoxH = Math.max(leftY, rightY) - certBoxTop + certBoxPad;
    drawSectionBoxBorder(certBoxTop, certBoxH);

    // Vertical divider between columns
    doc.moveTo(MARGIN + CONTENT_W / 2, certBoxTop + 4)
       .lineTo(MARGIN + CONTENT_W / 2, certBoxTop + certBoxH - 4)
       .strokeColor('#DDD').stroke();

    y = certBoxTop + certBoxH;

    // ── OWNER DETAILS SECTION ─────────────────────────────────────────────
    y += 8;
    y = drawSectionBar('Owner Details', y);
    const ownerBoxTop = y;
    let ownerY = y + certBoxPad;

    ownerY = drawFieldRow('Issued To', cert.issuedTo, leftColX, ownerY);
    ownerY = drawFieldRow('ID Number', cert.idNumber, leftColX, ownerY);
    ownerY = drawFieldRow('Phone Number', cert.phoneNumber, leftColX, ownerY);

    const ownerBoxH = ownerY - ownerBoxTop + certBoxPad;
    drawSectionBoxBorder(ownerBoxTop, ownerBoxH);
    y = ownerBoxTop + ownerBoxH;

    // ── VEHICLE DETAILS SECTION ───────────────────────────────────────────
    y += 8;
    y = drawSectionBar('Vehicle Details', y);
    const vehBoxTop = y;
    let vLeftY = y + certBoxPad;
    let vRightY = y + certBoxPad;

    // Left column
    vLeftY = drawFieldRow('Registration No', cert.vehicleRegNumber, leftColX, vLeftY, true);
    vLeftY = drawFieldRow('Make', cert.make, leftColX, vLeftY);
    vLeftY = drawFieldRow('Body Type', cert.bodyType, leftColX, vLeftY);

    // Right column
    vRightY = drawFieldRow('Device Fitted', cert.deviceFittedWith, rightColX, vRightY, true);
    vRightY = drawFieldRow('IMEI No', cert.imeiNo, rightColX, vRightY);
    vRightY = drawFieldRow('SIM No', cert.simNo, rightColX, vRightY);

    // Install date — amber highlight
    doc.rect(rightColX + 89, vRightY - 1, 100, 14).fill('#FFF8E1');
    doc.font(loraBoldFont).fontSize(8.5).fillColor(NAVY)
       .text('Install Date:', rightColX, vRightY, { width: 89, lineBreak: false });
    doc.font(loraBoldFont).fontSize(8.5).fillColor('#7A5800')
       .text(fmt(cert.dateOfInstallation), rightColX + 93, vRightY, { width: 96, lineBreak: false });
    vRightY += 14;

    // Expiry date — red highlight
    doc.rect(rightColX + 89, vRightY - 1, 100, 14).fill('#FFE8E8');
    doc.font(loraBoldFont).fontSize(8.5).fillColor(NAVY)
       .text('Expiry Date:', rightColX, vRightY, { width: 89, lineBreak: false });
    doc.font(loraBoldFont).fontSize(8.5).fillColor('#B00000')
       .text(fmt(cert.expiryDate), rightColX + 93, vRightY, { width: 96, lineBreak: false });
    vRightY += 14;

    const vBoxH = Math.max(vLeftY, vRightY) - vehBoxTop + certBoxPad;
    drawSectionBoxBorder(vehBoxTop, vBoxH);

    // Vertical divider
    doc.moveTo(MARGIN + CONTENT_W / 2, vehBoxTop + 4)
       .lineTo(MARGIN + CONTENT_W / 2, vehBoxTop + vBoxH - 4)
       .strokeColor('#DDD').stroke();

    y = vehBoxTop + vBoxH;

    // ── BOTTOM SECTION ────────────────────────────────────────────────────
    y += 10;
    const bottomY = y;

    // Fitted By + Signature
    doc.font(robotoFont).fontSize(8).fillColor('#555')
       .text('Fitted By:', MARGIN + 8, bottomY, { lineBreak: false });
    doc.font(loraBoldFont).fontSize(10).fillColor(NAVY)
       .text('Dennis Karani', MARGIN + 8, bottomY + 13, { lineBreak: false });

    const sigPath = path.join(__dirname, '../../frontend/public/assets/signature.png');
    try {
      doc.image(sigPath, MARGIN + 8, bottomY + 27, { width: 85, height: 38 });
    } catch (e) { /* signature image missing — skip */ }

    doc.font(robotoFont).fontSize(7.5).fillColor('#666')
       .text('Authorized Installer', MARGIN + 8, bottomY + 68, { lineBreak: false });
    doc.moveTo(MARGIN + 8, bottomY + 66)
       .lineTo(MARGIN + 108, bottomY + 66)
       .strokeColor('#aaa').lineWidth(0.5).stroke();

    // Official Stamp box (dashed)
    const stampX = MARGIN + 130;
    doc.rect(stampX, bottomY + 5, 88, 68)
       .dash(3, { space: 3 }).strokeColor(NAVY).lineWidth(1.5).stroke();
    doc.undash();
    doc.font(robotoFont).fontSize(7).fillColor('#999')
       .text('Official\nCompany\nStamp', stampX + 10, bottomY + 22, { width: 68, align: 'center' });

    // Certification badges row
    const badgeX = MARGIN + 240;
    doc.font(robotoFont).fontSize(7).fillColor('#666')
       .text('Certified By:', badgeX + 20, bottomY, { lineBreak: false });

    // NTSA placeholder badge (navy circle, radius=25, centered at badgeX+25, bottomY+36)
    doc.circle(badgeX + 25, bottomY + 36, 25).fill(NAVY);
    doc.font(loraBoldFont).fontSize(7).fillColor('#FFFFFF')
       .text('NTSA\nCertified', badgeX + 8, bottomY + 26, { width: 34, align: 'center' });

    const kebsBadge = path.join(__dirname, '../../frontend/public/assets/kebs-badge.png');
    try {
      doc.image(kebsBadge, badgeX + 56, bottomY + 11, { width: 50, height: 50 });
    } catch (e) {
      console.warn('[CERT PRINT] kebs-badge.png missing from frontend/public/assets/ — badge skipped.');
    }

    const odpcBadge = path.join(__dirname, '../../frontend/public/assets/odpc-badge.png');
    try {
      doc.image(odpcBadge, badgeX + 112, bottomY + 11, { width: 50, height: 50 });
    } catch (e) {
      console.warn('[CERT PRINT] odpc-badge.png missing from frontend/public/assets/ — badge skipped.');
    }

    // ── FOOTER ────────────────────────────────────────────────────────────
    const footerY = 800;
    doc.rect(0, footerY, PAGE_W, 41.89).fill(NAVY);
    doc.font(robotoFont).fontSize(7).fillColor('#FFFFFF')
       .text(
         'This is a computer-generated certificate issued by Nebsam Digital Solutions (K) Ltd.\nNo signature is required.',
         MARGIN, footerY + 12,
         { width: CONTENT_W, align: 'center' }
       );

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