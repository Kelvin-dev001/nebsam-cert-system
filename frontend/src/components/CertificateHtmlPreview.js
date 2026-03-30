import React from "react";
import { Box, Typography } from "@mui/material";

// ── Design tokens (must match CertificateDocument.js) ──────────────────────
const NAVY = "#1B2A4A";
const GOLD = "#C5962A";
const WHITE = "#FFFFFF";
const LIGHT_BG = "#F4F1EC";

// ── Helper: section header bar ──────────────────────────────────────────────
function SectionHeader({ title }) {
  return (
    <Box
      sx={{
        backgroundColor: NAVY,
        py: 0.75,
        px: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <Typography sx={{ color: GOLD, fontSize: "11px", lineHeight: 1 }}>&#9670;</Typography>
      <Typography
        sx={{
          color: WHITE,
          fontFamily: "'Lora', serif",
          fontWeight: 700,
          fontSize: "12px",
          letterSpacing: "0.5px",
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ color: GOLD, fontSize: "11px", lineHeight: 1 }}>&#9670;</Typography>
    </Box>
  );
}

// ── Helper: field row ───────────────────────────────────────────────────────
function FieldRow({ label, value, bold }) {
  return (
    <Box sx={{ display: "flex", mb: 0.6, alignItems: "flex-start" }}>
      <Typography
        sx={{
          fontFamily: "'Lora', serif",
          fontWeight: 700,
          fontSize: "10px",
          color: NAVY,
          width: 100,
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "10px", color: NAVY, mr: 0.5 }}>
        :
      </Typography>
      <Typography
        sx={{
          fontFamily: bold ? "'Lora', serif" : "'Roboto', sans-serif",
          fontWeight: bold ? 700 : 400,
          fontSize: "10px",
          color: bold ? NAVY : "#333",
          flex: 1,
        }}
      >
        {value || ""}
      </Typography>
    </Box>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
// NOTE: The following image files must be placed in frontend/public/assets/:
//   - signature.png   (authorized installer signature)
//   - kebs-badge.png  (KEBS Standardization Mark)
//   - odpc-badge.png  (Office of the Data Protection Commissioner)
// See frontend/public/assets/README.md for details.
const CertificateHtmlPreview = ({ cert = {}, qrDataUrl = null }) => {
  const fmt = (d) => (d ? String(d).slice(0, 10) : "");
  const isTracking = cert.type === "tracking";

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 820,
        mx: "auto",
        backgroundColor: LIGHT_BG,
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
        fontFamily: "'Roboto', sans-serif",
        fontSize: "10px",
      }}
    >
      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <Box
        sx={{
          backgroundColor: NAVY,
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Box
          component="img"
          src="/nebsam-logo.png"
          alt="Nebsam logo"
          sx={{ width: 72, height: 72, objectFit: "contain" }}
        />
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: "'Lora', serif",
              fontWeight: 700,
              fontSize: "30px",
              color: WHITE,
              letterSpacing: "4px",
            }}
          >
            NEBSAM
          </Typography>
          <Typography
            sx={{ fontFamily: "'Roboto', sans-serif", fontSize: "11px", color: GOLD, letterSpacing: "1px", mt: 0.4 }}
          >
           We Are The Solutions
          </Typography>
        </Box>
      </Box>

      {/* Gold divider */}
      <Box sx={{ height: 4, backgroundColor: GOLD }} />

      {/* ── TITLE ───────────────────────────────────────────────────── */}
      <Box sx={{ backgroundColor: "#FAFAF6", py: 2, textAlign: "center" }}>
        <Typography
          sx={{
            fontFamily: "'Lora', serif",
            fontWeight: 700,
            fontSize: "26px",
            color: NAVY,
            letterSpacing: "1px",
          }}
        >
          Certificate of Installation
        </Typography>
        <Typography sx={{ color: GOLD, fontSize: "16px", mt: 0.6, letterSpacing: "10px" }}>
          &#9670;&#9670;&#9670;
        </Typography>
      </Box>

      {/* Gold divider */}
      <Box sx={{ height: 4, backgroundColor: GOLD }} />

      {/* ── CERTIFICATE DETAILS ─────────────────────────────────────── */}
      <Box sx={{ mx: 2.5, mt: 1.5, mb: 1 }}>
        <SectionHeader title="Certificate Details" />
        <Box
          sx={{
            border: `1px solid ${NAVY}`,
            borderTop: "none",
            backgroundColor: WHITE,
            p: 1.5,
            display: "flex",
            gap: 2,
          }}
        >
          {/* Left: type, serial, date */}
          <Box sx={{ flex: 1, borderRight: `1px solid #DDD`, pr: 2 }}>
            <FieldRow
              label="Type"
              value={isTracking ? "Vehicle Tracking Installation" : "Radio Call Ownership"}
            />
            {/* Serial number in a bordered box */}
            <Box sx={{ display: "flex", mb: 0.6, alignItems: "center" }}>
              <Typography
                sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "10px", color: NAVY, width: 100, flexShrink: 0 }}
              >
                Serial No
              </Typography>
              <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "10px", color: NAVY, mr: 0.5 }}>:</Typography>
              <Box sx={{ border: `1px solid ${NAVY}`, px: 1, py: 0.2 }}>
                <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "13px", color: NAVY }}>
                  {cert.certificateSerialNo || ""}
                </Typography>
              </Box>
            </Box>
            <FieldRow label="Date of Issue" value={fmt(cert.dateOfIssue)} />
          </Box>

          {/* Right: company info + small QR */}
          <Box sx={{ flex: 1, pl: 1 }}>
            <Typography
              sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "10px", color: NAVY, mb: 0.5 }}
            >
              Nebsam Digital Solutions (K) Ltd
            </Typography>
            <Typography sx={{ fontFamily: "'Roboto', sans-serif", fontSize: "9px", color: "#555", mb: 0.25 }}>
             hQ-MSA Makupa Roundabout Nxt To Mass Petrolstation | 0759000111
            </Typography>
            <Typography sx={{ fontFamily: "'Roboto', sans-serif", fontSize: "9px", color: "#555", mb: 0.25 }}>
              info@nebsamdigital.com
            </Typography>
            <Typography sx={{ fontFamily: "'Roboto', sans-serif", fontSize: "9px", color: "#555", mb: 0.5 }}>
              www.nebsamdigital.com
            </Typography>
            {qrDataUrl && (
              <Box component="img" src={qrDataUrl} alt="qr" sx={{ width: 60, height: 60 }} />
            )}
          </Box>
        </Box>
      </Box>

      {/* ── OWNER DETAILS ───────────────────────────────────────────── */}
      <Box sx={{ mx: 2.5, mb: 1 }}>
        <SectionHeader title="Owner Details" />
        <Box sx={{ border: `1px solid ${NAVY}`, borderTop: "none", backgroundColor: WHITE, p: 1.5 }}>
          <FieldRow label="Issued To" value={cert.issuedTo} />
          <FieldRow label="ID Number" value={cert.idNumber} />
          <FieldRow label="Phone Number" value={cert.phoneNumber} />
        </Box>
      </Box>

      {/* ── VEHICLE DETAILS ─────────────────────────────────────────── */}
      <Box sx={{ mx: 2.5, mb: 1 }}>
        <SectionHeader title="Vehicle Details" />
        <Box
          sx={{
            border: `1px solid ${NAVY}`,
            borderTop: "none",
            backgroundColor: WHITE,
            p: 1.5,
            display: "flex",
            gap: 2,
          }}
        >
          {/* Left: registration, make, body type */}
          <Box sx={{ flex: 1, borderRight: `1px solid #DDD`, pr: 2 }}>
            <FieldRow label="Registration No" value={cert.vehicleRegNumber} bold />
            <FieldRow label="Make" value={cert.make} />
            <FieldRow label="Body Type" value={cert.bodyType} />
          </Box>

          {/* Right: device, IMEI, SIM, dates */}
          <Box sx={{ flex: 1, pl: 1 }}>
            <FieldRow label="Device Fitted" value={cert.deviceFittedWith} bold />
            <FieldRow label="IMEI No" value={cert.imeiNo} />
            <FieldRow label="SIM No" value={cert.simNo} />

            {/* Installation date — amber highlight */}
            <Box sx={{ display: "flex", mb: 0.6, alignItems: "center" }}>
              <Typography
                sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "10px", color: NAVY, width: 100, flexShrink: 0 }}
              >
                Install Date
              </Typography>
              <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "10px", color: NAVY, mr: 0.5 }}>:</Typography>
              <Box sx={{ backgroundColor: "#FFF8E1", px: 0.75, py: 0.2, flex: 1 }}>
                <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "10px", color: "#7A5800" }}>
                  {fmt(cert.dateOfInstallation)}
                </Typography>
              </Box>
            </Box>

            {/* Expiry date — red highlight */}
            <Box sx={{ display: "flex", mb: 0.6, alignItems: "center" }}>
              <Typography
                sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "10px", color: NAVY, width: 100, flexShrink: 0 }}
              >
                Expiry Date
              </Typography>
              <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "10px", color: NAVY, mr: 0.5 }}>:</Typography>
              <Box sx={{ backgroundColor: "#FFE8E8", px: 0.75, py: 0.2, flex: 1 }}>
                <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "10px", color: "#B00000" }}>
                  {fmt(cert.expiryDate)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── BOTTOM SECTION ──────────────────────────────────────────── */}
      <Box
        sx={{
          mx: 2.5,
          mt: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        {/* Fitted By + Signature */}
        <Box sx={{ width: 130, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography sx={{ fontFamily: "'Roboto', sans-serif", fontSize: "9px", color: "#555", mb: 0.25 }}>
            Fitted By:
          </Typography>
          <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "11px", color: NAVY, mb: 0.5 }}>
            Dennis Karani
          </Typography>
          <Box
            component="img"
            src="/assets/signature.png"
            alt="Authorized Installer Signature"
            sx={{ width: 90, height: 40, objectFit: "contain", mb: 0.5 }}
          />
          <Typography
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "9px",
              color: "#666",
              borderTop: "1px solid #aaa",
              pt: 0.25,
              textAlign: "center",
              width: 110,
            }}
          >
            Authorized Installer
          </Typography>
        </Box>

        {/* Official Company Stamp */}
        <Box sx={{ width: 105, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box
            sx={{
              border: `1.5px dashed ${NAVY}`,
              width: 90,
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ fontFamily: "'Roboto', sans-serif", fontSize: "8px", color: "#999", textAlign: "center" }}>
              Official<br />Company<br />Stamp
            </Typography>
          </Box>
        </Box>

        {/* Certification badges */}
        <Box sx={{ width: 185, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography sx={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "12px", color: NAVY, mb: 0.75 }}>
            Certified By:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Box component="img" src="/assets/kebs-badge.png" alt="KEBS" sx={{ width: 52, height: 52, objectFit: "contain", mx: 0.5 }} />
            <Box component="img" src="/assets/odpc-badge.png" alt="ODPC" sx={{ width: 52, height: 52, objectFit: "contain", mx: 0.5 }} />
            <Box component="img" src="/assets/cak-badge.png" alt="CAK" sx={{ width: 52, height: 52, objectFit: "contain", mx: 0.5 }} />
          </Box>
        </Box>

        {/* QR Code */}
        <Box sx={{ width: 95, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {qrDataUrl && (
            <>
              <Box component="img" src={qrDataUrl} alt="QR code" sx={{ width: 72, height: 72 }} />
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "8px",
                  color: "#666",
                  textAlign: "center",
                  mt: 0.5,
                  lineHeight: 1.3,
                }}
              >
                Scan to Verify<br />Certificate
              </Typography>
            </>
          )}
        </Box>
      </Box>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <Box sx={{ backgroundColor: NAVY, py: 1.2, px: 3, mt: 1.5 }}>
        <Typography
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "9px",
            color: WHITE,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          This is a computer-generated certificate issued by Nebsam Digital Solutions (K) Ltd.
          <br />No signature is required.
        </Typography>
      </Box>
    </Box>
  );
};

export default CertificateHtmlPreview;
