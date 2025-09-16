import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_BASE = "http://localhost:5000";

const CertificatePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // Certificate and loading states
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  // Approve/OTP states
  const [approveLoading, setApproveLoading] = useState(false);
  const [approveMsg, setApproveMsg] = useState("");
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);

  // Print states
  const [shareLoading, setShareLoading] = useState(false);

  // Snackbar states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Error state
  const [otpError, setOtpError] = useState("");

  // Fetch certificate data
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/api/certificates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setCert(res.data))
      .catch(() => setCert(null))
      .finally(() => setLoading(false));
  }, [id, token, snackbar.open]);

  // Approve Button Handler
  const handleApprove = async () => {
    setApproveLoading(true);
    setApproveMsg("");
    setOtpError("");
    try {
      const res = await axios.post(
        `${API_BASE}/api/certificates/${cert._id}/approve-otp`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setApproveMsg("OTP sent to admin numbers. Please request OTP from admin and enter it below.");
        setOtpDialogOpen(true);
      } else {
        setApproveMsg(res.data.msg || "Failed to send OTP.");
        setSnackbar({
          open: true,
          message: res.data.msg || "Failed to send OTP.",
          severity: "error"
        });
      }
    } catch (err) {
      const msg = err.response?.data?.msg || "Error sending OTP for approval.";
      setApproveMsg(msg);
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setApproveLoading(false);
    }
  };

  // OTP Dialog Submit Handler
  const handleOtpSubmit = async () => {
    setOtpVerifying(true);
    setOtpError("");
    try {
      const res = await axios.post(
        `${API_BASE}/api/certificates/${cert._id}/verify-otp`,
        { otp: otpInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setSnackbar({
          open: true,
          message: "Certificate successfully approved!",
          severity: "success"
        });
        setOtpDialogOpen(false);
        setOtpInput("");
        setOtpError("");
      } else {
        setOtpError(res.data.msg || "Invalid OTP.");
        setSnackbar({
          open: true,
          message: res.data.msg || "Failed to approve certificate.",
          severity: "error"
        });
      }
    } catch (err) {
      const msg = err.response?.data?.msg || "OTP verification failed.";
      setOtpError(msg);
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setOtpVerifying(false);
    }
  };

  // Print/Share Button Handler (only allowed when approved)
  const handleSharePrint = async () => {
    setShareLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}/api/certificates/${cert._id}/share`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob"
        }
      );
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `certificate_${cert.certificateSerialNo}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setSnackbar({
        open: true,
        message: "Certificate successfully downloaded!",
        severity: "success"
      });
    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        "Share/Print error. Make sure certificate is approved.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setShareLoading(false);
    }
  };

  // Close snackbar
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
        <Typography>
          <b>Approval Status:</b>{" "}
          {cert.approved
            ? `Approved at ${cert.approvedAt?.slice(0, 19).replace("T", " ")}`
            : "Not Approved"}
        </Typography>
      </Stack>

      {/* Approve & Print Buttons */}
      {!cert.approved ? (
        <>
          <Button
            variant="contained"
            sx={{ mt: 4, mr: 2 }}
            onClick={handleApprove}
            disabled={approveLoading}
          >
            {approveLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Approve (OTP Required)"
            )}
          </Button>
          {approveMsg && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {approveMsg}
            </Alert>
          )}
        </>
      ) : (
        <Button
          variant="contained"
          sx={{ mt: 4, mr: 2 }}
          onClick={handleSharePrint}
          disabled={shareLoading}
        >
          {shareLoading ? <CircularProgress size={24} /> : "Share / Print"}
        </Button>
      )}
      <Button variant="outlined" sx={{ mt: 4 }} onClick={() => navigate(-1)}>
        Back
      </Button>

      {/* OTP Dialog */}
      <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)}>
        <DialogTitle>Enter Approval OTP</DialogTitle>
        <DialogContent>
          <Typography mb={2}>
            Please get the OTP sent to admin numbers and enter it below.
          </Typography>
          <TextField
            label="OTP"
            fullWidth
            value={otpInput}
            onChange={e => setOtpInput(e.target.value)}
            margin="normal"
            inputProps={{ maxLength: 6 }}
            disabled={otpVerifying}
          />
          {otpError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {otpError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOtpDialogOpen(false)}
            disabled={otpVerifying}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleOtpSubmit}
            disabled={otpVerifying || otpInput.length !== 6}
          >
            {otpVerifying ? <CircularProgress size={24} /> : "Verify & Approve"}
          </Button>
        </DialogActions>
      </Dialog>

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