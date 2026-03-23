import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Font registration
Font.register({ family: "Lora", src: "/fonts/Lora-Regular.ttf" });
Font.register({ family: "Lora-Bold", src: "/fonts/Lora-Bold.ttf" });
Font.register({ family: "Roboto", src: "/fonts/Roboto-Regular.ttf" });

// A4 dimensions in points
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 0,
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#111",
    position: "relative",
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  },
  templateBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  },
  fieldValue: {
    position: "absolute",
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#111",
  },
  qrCode: {
    position: "absolute",
    width: 80,
    height: 80,
  },
});

const format = d => (d ? d.slice(0, 10) : "");

// Helper: render a text value at absolute coordinates
const Val = ({ x, y, children, fontSize, color }) => (
  <Text
    style={[
      styles.fieldValue,
      { left: x, top: y, fontSize: fontSize || 10, color: color || "#111" },
    ]}
  >
    {children}
  </Text>
);

const CertificateDocument = ({ cert = {}, qr = null }) => {
  const isTracking = cert.type === "tracking";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Full-page background template */}
        <Image src="/certificate-template.png" style={styles.templateBackground} fixed />

        {/* Dynamic overlay values */}
        <View style={styles.overlay}>
          {/* Certificate Details section */}
          <Val x={62} y={295}>
            {isTracking ? "Vehicle Tracking Installation" : "Radio Call Ownership"}
          </Val>
          <Val x={62} y={348}>{cert.certificateSerialNo || ""}</Val>
          <Val x={62} y={393}>{format(cert.dateOfIssue)}</Val>

          {/* Owner Details section */}
          <Val x={62} y={478}>{cert.issuedTo || ""}</Val>
          <Val x={62} y={517}>{cert.idNumber || ""}</Val>
          <Val x={62} y={555}>{cert.phoneNumber || ""}</Val>

          {/* Vehicle Details section — left column */}
          <Val x={145} y={635}>{cert.vehicleRegNumber || ""}</Val>
          <Val x={62} y={665}>{cert.make || ""}</Val>
          <Val x={130} y={695}>{cert.bodyType || ""}</Val>

          {/* Vehicle Details section — right column */}
          <Val x={355} y={635}>{cert.deviceFittedWith || ""}</Val>
          <Val x={388} y={668}>{cert.imeiNo || ""}</Val>
          <Val x={388} y={695}>{cert.simNo || ""}</Val>
          <Val x={415} y={722}>{format(cert.dateOfInstallation)}</Val>
          <Val x={415} y={748}>{format(cert.expiryDate)}</Val>

          {/* Bottom — Fitted By (hardcoded) */}
          <Val x={100} y={778}>Dennis Karani</Val>

          {/* QR Code */}
          {qr && (
            <Image src={qr} style={[styles.qrCode, { left: 458, top: 750 }]} />
          )}
        </View>
      </Page>
    </Document>
  );
};

export default CertificateDocument;