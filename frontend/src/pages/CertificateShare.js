import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Button, TextField, Stack, Snackbar, Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { AuthContext } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE;

const CertificateShare = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [cert, setCert] = useState(null);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/certificates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setCert(res.data);
        // Pre-fill phone number from certificate (strip leading + if present)
        if (res.data.phoneNumber) {
          setPhoneNumber(res.data.phoneNumber.replace(/^\+/, ""));
        }
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleEmailSend = () => {
    alert(`Send certificate PDF to: ${email} (not implemented)`);
  };

  const handleWhatsAppShare = () => {
    const rawPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (!rawPhone) {
      setSnackbar({ open: true, message: "Please enter a phone number (e.g. 254712345678)", severity: "warning" });
      return;
    }

    const verificationUrl = `${window.location.origin}/certificates/${cert._id}/preview`;
    const fmt = d => (d ? String(d).slice(0, 10) : "—");

    const lines = [
      `*NEBSAM Certificate of Installation*`,
      `━━━━━━━━━━━━━━━━━━━━━━━`,
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

    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`🔗 View Certificate: ${verificationUrl}`);

    const message = lines.join("\n");
    window.open(`https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!cert) return <Typography>Certificate not found.</Typography>;

  return (
    <Box maxWidth={600} mx="auto" mt={5} p={3}>
      <Typography variant="h5" mb={2}>Share Certificate</Typography>
      <Stack spacing={2}>
        <TextField label="Recipient Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Button variant="contained" color="primary" onClick={handleEmailSend}>Send by Email</Button>

        <TextField
          label="WhatsApp Phone Number (international format, e.g. 254712345678)"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          placeholder="254712345678"
          helperText="Enter number with country code, no + sign"
        />
        <Button
          variant="contained"
          color="success"
          startIcon={<WhatsAppIcon />}
          onClick={handleWhatsAppShare}
        >
          Share via WhatsApp
        </Button>

        <Button variant="outlined" onClick={handlePrint}>Print</Button>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CertificateShare;