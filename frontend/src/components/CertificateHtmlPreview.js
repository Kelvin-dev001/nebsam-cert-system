import React from "react";
import { Box } from "@mui/material";

/*
  CertificateHtmlPreview.js
  - Visible HTML preview for on-screen preview before PDF download.
  - Uses certificate-template.png as a full-page background image with
    CSS absolutely-positioned overlays for dynamic values.
*/

// A4 aspect ratio: 595.28 / 841.89 ≈ 0.7071
// We render the preview at a fixed width and scale coordinates proportionally.
const TEMPLATE_W = 595.28;
const TEMPLATE_H = 841.89;

const CertificateHtmlPreview = ({ cert = {}, qrDataUrl = null }) => {
  const format = (d) => (d ? d.slice(0, 10) : "");

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

      {/* Dynamic overlays — coordinates expressed as % of template dimensions */}
      {/* Certificate Details */}
      <Val x={62} y={295} w={TEMPLATE_W} h={TEMPLATE_H}>
        {cert.type === "tracking" ? "Vehicle Tracking Installation" : "Radio Call Ownership"}
      </Val>
      <Val x={62} y={348} w={TEMPLATE_W} h={TEMPLATE_H}>
        {cert.certificateSerialNo || ""}
      </Val>
      <Val x={62} y={393} w={TEMPLATE_W} h={TEMPLATE_H}>
        {format(cert.dateOfIssue)}
      </Val>

      {/* Owner Details */}
      <Val x={62} y={478} w={TEMPLATE_W} h={TEMPLATE_H}>
        {cert.issuedTo || ""}
      </Val>
      <Val x={62} y={517} w={TEMPLATE_W} h={TEMPLATE_H}>
        {cert.idNumber || ""}
      </Val>
      <Val x={62} y={555} w={TEMPLATE_W} h={TEMPLATE_H}>
        {cert.phoneNumber || ""}
      </Val>

      {/* Vehicle Details — left column */}
      <Val x={145} y={635} w={TEMPLATE_W} h={TEMPLATE_H}>
        {cert.vehicleRegNumber || ""}
      </Val>
      <Val x={62} y={665} w={TEMPLATE_W} h={TEMPLATE_H}>
        {cert.make || ""}
      </Val>
      <Val x={130} y={695} w={TEMPLATE_W} h={TEMPLATE_H}>
        {cert.bodyType || ""}
      </Val>

      {/* Vehicle Details — right column */}
      <Val x={355} y={635} w={TEMPLATE_W} h={TEMPLATE_H}>
        {cert.deviceFittedWith || ""}
      </Val>
      <Val x={388} y={668} w={TEMPLATE_W} h={TEMPLATE_H}>
        {cert.imeiNo || ""}
      </Val>
      <Val x={388} y={695} w={TEMPLATE_W} h={TEMPLATE_H}>
        {cert.simNo || ""}
      </Val>
      <Val x={415} y={722} w={TEMPLATE_W} h={TEMPLATE_H}>
        {format(cert.dateOfInstallation)}
      </Val>
      <Val x={415} y={748} w={TEMPLATE_W} h={TEMPLATE_H}>
        {format(cert.expiryDate)}
      </Val>

      {/* Bottom — Fitted By */}
      <Val x={100} y={778} w={TEMPLATE_W} h={TEMPLATE_H}>
        Dennis Karani
      </Val>

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
};

// Helper: render a value at absolute coordinates scaled to template dimensions
function Val({ x, y, w, h, children }) {
  return (
    <Box
      sx={{
        position: "absolute",
        left: `${(x / w) * 100}%`,
        top: `${(y / h) * 100}%`,
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

export default CertificateHtmlPreview;