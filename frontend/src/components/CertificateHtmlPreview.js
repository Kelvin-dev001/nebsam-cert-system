import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";

/*
  CertificateHtmlPreview.js
  - Visible HTML preview for on-screen preview before PDF download.
  - Mirrors the PDF layout and styling (approximate).
*/

const labelStyle = { fontWeight: 700, color: "#444", width: 150 };
const valueStyle = { color: "#111" };

const CertificateHtmlPreview = ({ cert = {}, qrDataUrl = null, signatureUrl = "/seal.png" }) => {
  const format = (d) => (d ? d.slice(0, 10) : "");
  return (
    <Box>
      <Box textAlign="center" mb={1}>
        <img src="/logo.png" alt="logo" style={{ width: 120 }} />
        <Typography variant="h6" sx={{ fontFamily: "'Lora', serif", fontWeight: 700 }}>
          Nebsam Digital Solutions (K) Ltd
        </Typography>
        <Typography sx={{ fontWeight: 700, fontSize: 12 }}>
          P.O Box: 82436-80100, Mombasa, Kenya · Tel: 0759000111 · info@nebsamdigital.com
        </Typography>
        <Typography sx={{ mt: 1, fontWeight: 700, fontSize: 14, textDecoration: "underline" }}>
          Certificate of Installation
        </Typography>
      </Box>

      <Box mt={2}>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography sx={{ fontWeight: 700, color: "#0a4b7a", mb: 1 }}>Certificate Details</Typography>
          <Grid container spacing={1}>
            <Grid item xs={4} sx={labelStyle}>Type:</Grid>
            <Grid item xs={8} sx={valueStyle}>{cert.type === "tracking" ? "Vehicle Tracking Installation" : "Radio Call Ownership"}</Grid>

            <Grid item xs={4} sx={labelStyle}>Serial No:</Grid>
            <Grid item xs={8} sx={valueStyle}>{cert.certificateSerialNo}</Grid>

            <Grid item xs={4} sx={labelStyle}>Date of Issue:</Grid>
            <Grid item xs={8} sx={valueStyle}>{format(cert.dateOfIssue)}</Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography sx={{ fontWeight: 700, color: "#0a4b7a", mb: 1 }}>Owner Details</Typography>
          <Grid container spacing={1}>
            <Grid item xs={4} sx={labelStyle}>Issued To:</Grid>
            <Grid item xs={8} sx={valueStyle}>{cert.issuedTo}</Grid>

            <Grid item xs={4} sx={labelStyle}>ID Number:</Grid>
            <Grid item xs={8} sx={valueStyle}>{cert.idNumber}</Grid>

            <Grid item xs={4} sx={labelStyle}>Phone Number:</Grid>
            <Grid item xs={8} sx={valueStyle}>{cert.phoneNumber}</Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography sx={{ fontWeight: 700, color: "#0a4b7a", mb: 1 }}>Vehicle Details</Typography>
          <Grid container spacing={1}>
            <Grid item xs={4} sx={labelStyle}>Registration No:</Grid>
            <Grid item xs={8} sx={valueStyle}>{cert.vehicleRegNumber}</Grid>

            <Grid item xs={4} sx={labelStyle}>Make:</Grid>
            <Grid item xs={8} sx={valueStyle}>{cert.make}</Grid>

            <Grid item xs={4} sx={labelStyle}>Body Type:</Grid>
            <Grid item xs={8} sx={valueStyle}>{cert.bodyType}</Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography sx={{ fontWeight: 700, color: "#0a4b7a", mb: 1 }}>Device Details</Typography>
          <Grid container spacing={1}>
            <Grid item xs={4} sx={labelStyle}>Device Fitted With:</Grid>
            <Grid item xs={8} sx={valueStyle}>{cert.deviceFittedWith}</Grid>

            <Grid item xs={4} sx={labelStyle}>IMEI No:</Grid>
            <Grid item xs={8} sx={valueStyle}>{cert.imeiNo}</Grid>

            <Grid item xs={4} sx={labelStyle}>SIM No:</Grid>
            <Grid item xs={8} sx={valueStyle}>{cert.simNo}</Grid>

            <Grid item xs={4} sx={labelStyle}>Installation Date:</Grid>
            <Grid item xs={8} sx={valueStyle}>{format(cert.dateOfInstallation)}</Grid>

            <Grid item xs={4} sx={labelStyle}>Expiry Date:</Grid>
            <Grid item xs={8} sx={valueStyle}>{format(cert.expiryDate)}</Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, alignItems: "center" }}>
            {qrDataUrl ? <img src={qrDataUrl} alt="qr" style={{ width: 100 }} /> : <div />}
            <img src={signatureUrl} alt="signature" style={{ width: 140 }} />
          </Box>

          <Typography sx={{ mt: 1, fontWeight: 700 }}>Fitted By: Dennis Karani</Typography>
        </Paper>
      </Box>

      <Typography sx={{ fontSize: 10, textAlign: "center", color: "#777", mt: 2 }}>
        This is a computer generated certificate — no signature is required.
      </Typography>
    </Box>
  );
};

export default CertificateHtmlPreview;