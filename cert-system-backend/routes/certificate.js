const express = require("express");
const { check } = require("express-validator");
const certificateController = require("../controllers/certificateController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create new certificate
router.post(
  "/",
  auth,
  [
    check("type").isIn(["tracking", "radio"]).withMessage("Certificate type is required"),
    check("issuedTo").notEmpty().withMessage("Issued To is required"),
  ],
  certificateController.createCertificate
);

// Get user's certificates with filtering
router.get("/", auth, certificateController.getCertificates);

// Get certificate by id
router.get("/:id", auth, certificateController.getCertificateById);

// Update certificate
router.put(
  "/:id",
  auth,
  [
    check("type").optional().isIn(["tracking", "radio"]),
    check("issuedTo").optional().notEmpty(),
  ],
  certificateController.updateCertificate
);

// Delete certificate
router.delete("/:id", auth, certificateController.deleteCertificate);

// Email certificate
router.post("/:id/email", auth, certificateController.emailCertificate);

// WhatsApp share
router.post("/:id/whatsapp", auth, certificateController.whatsappCertificate);

router.post("/:id/share", auth, certificateController.shareCertificate);

module.exports = router;