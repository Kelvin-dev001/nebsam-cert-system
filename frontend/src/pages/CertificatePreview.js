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
import { AuthContext } from "../context/AuthContext";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CertificateDocument from "../components/CertificateDocument"; // Create this as shown previously

const API_BASE = process.env.REACT_APP_API_BASE;

const CertificatePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/api/certificates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setCert(res.data))
      .catch(() => setCert(null))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
    <Box maxWidth={700} mx="auto" mt={4} p={3} boxShadow={2} borderRadius={2}>
      <Typography variant="h5" mb={2}>
        Certificate Preview
      </Typography>
      <Divider />
      <Stack spacing={1} mt={2}>
        <Typography>
          <b>Type:</b>{" "}
          {cert.type === "tracking"
            ? "Vehicle Tracking Installation"
            : "Radio Call Ownership"}
        </Typography>
        {cert.type === "tracking" && (
          <>
            <Typography>
              <b>Vehicle Reg Number:</b> {cert.vehicleRegNumber}
            </Typography>
            <Typography>
              <b>Make:</b> {cert.make}
            </Typography>
            <Typography>
              <b>Body Type:</b> {cert.bodyType}
            </Typography>
            <Typography>
              <b>Chassis Number:</b> {cert.chassisNumber}
            </Typography>
            <Typography>
              <b>Device Fitted With:</b> {cert.deviceFittedWith}
            </Typography>
            <Typography>
              <b>IMEI No:</b> {cert.imeiNo}
            </Typography>
            <Typography>
              <b>SIM No:</b> {cert.simNo}
            </Typography>
            <Typography>
              <b>Date of Installation:</b> {cert.dateOfInstallation?.slice(0, 10)}
            </Typography>
            <Typography>
              <b>Expiry Date:</b> {cert.expiryDate?.slice(0, 10)}
            </Typography>
            <Typography>
              <b>Issued To:</b> {cert.issuedTo}
            </Typography>
            <Typography>
              <b>ID Number:</b> {cert.idNumber}
            </Typography>
            <Typography>
              <b>Phone Number:</b> {cert.phoneNumber}
            </Typography>
          </>
        )}
        {cert.type === "radio" && (
          <>
            <Typography>
              <b>Company Name:</b> {cert.companyName}
            </Typography>
            <Typography>
              <b>Radio License Number:</b> {cert.radioLicenseNumber}
            </Typography>
            <Typography>
              <b>Device ID:</b> {cert.deviceId}
            </Typography>
            <Typography>
              <b>Model:</b> {cert.model}
            </Typography>
            <Typography>
              <b>Issued To:</b> {cert.issuedTo}
            </Typography>
            <Typography>
              <b>CAK Number:</b> {cert.cakNumber}
            </Typography>
          </>
        )}
        <Typography>
          <b>Certificate Serial No:</b> {cert.certificateSerialNo}
        </Typography>
        <Typography>
          <b>Date of Issue:</b> {cert.dateOfIssue?.slice(0, 10)}
        </Typography>
      </Stack>

      {/* Edit Button */}
      <Button
        variant="contained"
        sx={{ mt: 4, mr: 2 }}
        onClick={() => navigate(`/certificates/${cert._id}/edit`)}
      >
        Edit
      </Button>

      {/* PDF Download Button */}
      <PDFDownloadLink
        document={<CertificateDocument cert={cert} />}
        fileName={`certificate_${cert.certificateSerialNo}.pdf`}
        style={{ textDecoration: "none", marginLeft: 8 }}
      >
        {({ loading }) =>
          loading ? (
            <Button variant="contained" disabled sx={{ mt: 4 }}>
              Preparing PDF...
            </Button>
          ) : (
            <Button variant="contained" color="success" sx={{ mt: 4 }}>
              Download Professional PDF
            </Button>
          )
        }
      </PDFDownloadLink>

      <Button variant="outlined" sx={{ mt: 4 }} onClick={() => navigate(-1)}>
        Back
      </Button>

      {/* Snackbar for success/fail feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CertificatePreview;