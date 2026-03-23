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

  // --- HTML Preview Component (template background overlay) ---
  const TEMPLATE_W = 595.28;
  const TEMPLATE_H = 841.89;

  function ValOverlay({ x, y, children }) {
    return (
      <Box
        sx={{
          position: "absolute",
          left: `${(x / TEMPLATE_W) * 100}%`,
          top: `${(y / TEMPLATE_H) * 100}%`,
          fontSize: "clamp(8px, 1.2vw, 11px)",
          color: "#111",
          fontFamily: "Roboto, sans-serif",
          fontWeight: 600,
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        {children}
      </Box>
    );
  }

  function CertificateHtmlPreview({ cert, qrDataUrl }) {
    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingBottom: `${(TEMPLATE_H / TEMPLATE_W) * 100}%`,
          overflow: "hidden",
          background: "#fff",
          boxShadow: 3,
        }}
      >
        {/* Background template image */}
        <Box
          component="img"
          src="/certificate-template.png"
          alt="certificate template"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            display: "block",
          }}
        />

        {/* Certificate Details */}
        <ValOverlay x={62} y={295}>
          {cert.type === "tracking" ? "Vehicle Tracking Installation" : "Radio Call Ownership"}
        </ValOverlay>
        <ValOverlay x={62} y={348}>{cert.certificateSerialNo || ""}</ValOverlay>
        <ValOverlay x={62} y={393}>{format(cert.dateOfIssue)}</ValOverlay>

        {/* Owner Details */}
        <ValOverlay x={62} y={478}>{cert.issuedTo || ""}</ValOverlay>
        <ValOverlay x={62} y={517}>{cert.idNumber || ""}</ValOverlay>
        <ValOverlay x={62} y={555}>{cert.phoneNumber || ""}</ValOverlay>

        {/* Vehicle Details — left column */}
        <ValOverlay x={145} y={635}>{cert.vehicleRegNumber || ""}</ValOverlay>
        <ValOverlay x={62} y={665}>{cert.make || ""}</ValOverlay>
        <ValOverlay x={130} y={695}>{cert.bodyType || ""}</ValOverlay>

        {/* Vehicle Details — right column */}
        <ValOverlay x={355} y={635}>{cert.deviceFittedWith || ""}</ValOverlay>
        <ValOverlay x={388} y={668}>{cert.imeiNo || ""}</ValOverlay>
        <ValOverlay x={388} y={695}>{cert.simNo || ""}</ValOverlay>
        <ValOverlay x={415} y={722}>{format(cert.dateOfInstallation)}</ValOverlay>
        <ValOverlay x={415} y={748}>{format(cert.expiryDate)}</ValOverlay>

        {/* Bottom — Fitted By */}
        <ValOverlay x={100} y={778}>Dennis Karani</ValOverlay>

        {/* QR Code */}
        {qrDataUrl && (
          <Box
            component="img"
            src={qrDataUrl}
            alt="qr"
            sx={{
              position: "absolute",
              left: `${(458 / TEMPLATE_W) * 100}%`,
              top: `${(750 / TEMPLATE_H) * 100}%`,
              width: `${(80 / TEMPLATE_W) * 100}%`,
            }}
          />
        )}
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
            document={<CertificateDocument cert={cert} qr={qrDataUrl} />}
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
            <CertificateHtmlPreview cert={cert} qrDataUrl={qrDataUrl} />
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