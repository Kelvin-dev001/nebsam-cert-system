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
import CertificateHtmlPreview from "../components/CertificateHtmlPreview";
import { AuthContext } from "../context/AuthContext";

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