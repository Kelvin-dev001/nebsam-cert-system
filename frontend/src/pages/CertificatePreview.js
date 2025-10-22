import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Snackbar,
  Alert,
  Paper,
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CertificateDocument from "../components/CertificateDocument";
import { AuthContext } from "../context/AuthContext";

// Font families should be registered in public/index.html for browser preview
// See earlier instructions

const API_BASE = process.env.REACT_APP_API_BASE;

const CertificatePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [signatureUrl, setSignatureUrl] = useState("/seal.png"); // Path to seal/signature image
  const [showHtmlPreview, setShowHtmlPreview] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/api/certificates/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setCert(res.data);
        // Create QR code for certificate verification/public preview URL
        const verificationUrl = `${window.location.origin}/certificates/${res.data._id}/preview`;
        QRCode.toDataURL(verificationUrl, { margin: 1, width: 120 })
          .then(url => setQrDataUrl(url))
          .catch(() => setQrDataUrl(null));
        setSignatureUrl("/seal.png"); // Update if you have a different filename
      })
      .catch(() => setCert(null))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  if (loading)
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  if (!cert)
    return (
      <Box mt={8}>
        <Typography>Certificate not found.</Typography>
      </Box>
    );

  const format = d => (d ? d.slice(0, 10) : "");

  // --- HTML Preview Component ---
  function CertificateHtmlPreview({ cert, qrDataUrl, signatureUrl }) {
    return (
      <Box sx={{ background: "#fff", borderRadius: 2, boxShadow: 2, p: 3, position: "relative", overflow: "hidden" }}>
        {/* Watermark */}
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            left: "-20%",
            right: "-20%",
            zIndex: 0,
            opacity: 0.07,
            pointerEvents: "none",
            transform: "rotate(-30deg)",
            fontWeight: 700,
            fontSize: { xs: 44, md: 68 },
            color: "#0a4b7a",
            userSelect: "none",
            textAlign: "center",
            fontFamily: "'Lora', serif",
            whiteSpace: "nowrap",
          }}
        >
          Nebsam Digital Solutions &nbsp; Nebsam Digital Solutions &nbsp; Nebsam Digital Solutions
        </Box>

        {/* Header */}
        <Box textAlign="center" mb={1} sx={{ position: "relative", zIndex: 1 }}>
          <img src="/logo.png" alt="logo" style={{ width: 120, marginBottom: 6 }} />
          <Typography variant="h6" sx={{ fontFamily: "'Lora', serif", fontWeight: 700 }}>
            Nebsam Digital Solutions (K) Ltd
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 12, color: "#333" }}>
            P.O Box: 82436-80100, Mombasa, Kenya · Tel: 0759000111 · info@nebsamdigital.com
          </Typography>
          <Typography sx={{ mt: 1, fontWeight: 700, fontSize: 16, textDecoration: "underline", color: "#0a4b7a" }}>
            Certificate of Installation
          </Typography>
        </Box>

        {/* Sections */}
        <Box mt={3} sx={{ position: "relative", zIndex: 1 }}>
          {/* Certificate Details */}
          <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Typography sx={{ fontWeight: 700, color: "#0a4b7a", mb: 1, fontFamily: "'Lora', serif" }}>Certificate Details</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}><b>Type:</b></Grid>
              <Grid item xs={6}>{cert.type === "tracking" ? "Vehicle Tracking Installation" : "Radio Call Ownership"}</Grid>
              <Grid item xs={6}><b>Serial No:</b></Grid>
              <Grid item xs={6}>{cert.certificateSerialNo}</Grid>
              <Grid item xs={6}><b>Date of Issue:</b></Grid>
              <Grid item xs={6}>{format(cert.dateOfIssue)}</Grid>
            </Grid>
          </Paper>

          {/* Owner Details */}
          <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Typography sx={{ fontWeight: 700, color: "#0a4b7a", mb: 1, fontFamily: "'Lora', serif" }}>Owner Details</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}><b>Issued To:</b></Grid>
              <Grid item xs={6}>{cert.issuedTo}</Grid>
              <Grid item xs={6}><b>ID Number:</b></Grid>
              <Grid item xs={6}>{cert.idNumber}</Grid>
              <Grid item xs={6}><b>Phone Number:</b></Grid>
              <Grid item xs={6}>{cert.phoneNumber}</Grid>
            </Grid>
          </Paper>

          {/* Vehicle Details */}
          <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Typography sx={{ fontWeight: 700, color: "#0a4b7a", mb: 1, fontFamily: "'Lora', serif" }}>Vehicle Details</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}><b>Registration No:</b></Grid>
              <Grid item xs={6}>{cert.vehicleRegNumber}</Grid>
              <Grid item xs={6}><b>Make:</b></Grid>
              <Grid item xs={6}>{cert.make}</Grid>
              <Grid item xs={6}><b>Body Type:</b></Grid>
              <Grid item xs={6}>{cert.bodyType}</Grid>
            </Grid>
          </Paper>

          {/* Device Details */}
          <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Typography sx={{ fontWeight: 700, color: "#0a4b7a", mb: 1, fontFamily: "'Lora', serif" }}>Device Details</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}><b>Device Fitted With:</b></Grid>
              <Grid item xs={6}>{cert.deviceFittedWith}</Grid>
              <Grid item xs={6}><b>IMEI No:</b></Grid>
              <Grid item xs={6}>{cert.imeiNo}</Grid>
              <Grid item xs={6}><b>SIM No:</b></Grid>
              <Grid item xs={6}>{cert.simNo}</Grid>
              <Grid item xs={6}><b>Installation Date:</b></Grid>
              <Grid item xs={6}>{format(cert.dateOfInstallation)}</Grid>
              <Grid item xs={6}><b>Expiry Date:</b></Grid>
              <Grid item xs={6}>{format(cert.expiryDate)}</Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, alignItems: "center" }}>
              {qrDataUrl ? <img src={qrDataUrl} alt="qr" style={{ width: 90 }} /> : <div />}
              <img src={signatureUrl} alt="seal" style={{ width: 110 }} />
            </Box>
            <Typography sx={{ mt: 1, fontWeight: 700 }}>Fitted By: Dennis Karani</Typography>
          </Paper>
        </Box>

        {/* Fine print */}
        <Typography sx={{ fontSize: 10, textAlign: "center", color: "#777", mt: 2 }}>
          This is a computer generated certificate — no signature is required.
        </Typography>
      </Box>
    );
  }

  // --- Main Render ---
  return (
    <Box maxWidth={900} mx="auto" mt={3} p={3}>
      <Typography variant="h5" mb={2}>Certificate Preview</Typography>
      <Divider />
      <Stack spacing={2} mt={2}>
        <Box display="flex" gap={2} alignItems="center">
          <Button variant="outlined" onClick={() => setShowHtmlPreview(s => !s)}>
            {showHtmlPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <PDFDownloadLink
            document={<CertificateDocument cert={cert} qr={qrDataUrl} signatureUrl={signatureUrl} />}
            fileName={`certificate_${cert.certificateSerialNo}.pdf`}
            style={{ textDecoration: "none", marginLeft: 8 }}
          >
            {({ loading: pdfLoading }) =>
              pdfLoading ? (
                <Button variant="contained" disabled>Preparing PDF...</Button>
              ) : (
                <Button variant="contained" color="success">Download PDF</Button>
              )
            }
          </PDFDownloadLink>
          <Button variant="contained" onClick={() => navigate(`/certificates/${cert._id}/edit`)}>Edit</Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
        </Box>

        {showHtmlPreview && (
          <Box mt={1}>
            <CertificateHtmlPreview cert={cert} qrDataUrl={qrDataUrl} signatureUrl={signatureUrl} />
          </Box>
        )}
      </Stack>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CertificatePreview;