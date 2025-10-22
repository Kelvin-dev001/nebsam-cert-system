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

/*
  src/components/CertificateDocument.js
  - Professional certificate for @react-pdf/renderer
  - Expected props:
      cert: object (certificate data)
      qr: string (data URL for QR image) optional
      signatureUrl: string (path to signature/seal image) optional, default '/seal.png'
  - Assets expected in public/:
      /logo.png, /seal.png, /fonts/Lora-Regular.ttf, /fonts/Lora-Bold.ttf, /fonts/Roboto-Regular.ttf
*/

// Register fonts that will be embedded in the PDF
Font.register({ family: "Lora", src: "/fonts/Lora-Regular.ttf" });
Font.register({ family: "Lora-Bold", src: "/fonts/Lora-Bold.ttf" });
Font.register({ family: "Roboto", src: "/fonts/Roboto-Regular.ttf" });

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 36,
    fontFamily: "Roboto",
    position: "relative",
    fontSize: 11,
    color: "#111",
  },

  watermarkContainer: {
    position: "absolute",
    top: "30%",
    left: -40,
    right: -40,
    alignItems: "center",
    zIndex: 0,
    opacity: 0.06,
    transform: "rotate(-30deg)",
  },
  watermarkText: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#222",
    letterSpacing: 3,
  },

  header: {
    alignItems: "center",
    marginBottom: 6,
    zIndex: 1,
  },
  logo: {
    width: 110,
    height: "auto",
    marginBottom: 6,
  },
  companyName: {
    fontSize: 18,
    fontFamily: "Lora-Bold",
    fontWeight: "bold",
    textAlign: "center",
  },
  companyContact: {
    fontSize: 10,
    fontFamily: "Roboto",
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginTop: 4,
  },
  certificateTitle: {
    fontSize: 14,
    fontFamily: "Lora",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
    textDecoration: "underline",
  },

  contentContainer: {
    marginTop: 6,
    marginBottom: 6,
    zIndex: 1,
  },

  section: {
    borderWidth: 1,
    borderColor: "#2c3e50",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fbfbfd",
  },
  sectionRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Lora",
    fontWeight: "bold",
    color: "#0a4b7a",
    marginBottom: 8,
  },
  label: {
    width: 140,
    fontWeight: "bold",
    fontSize: 10,
    color: "#444",
  },
  value: {
    fontSize: 11,
    color: "#111",
    flex: 1,
  },

  fittedBy: {
    marginTop: 6,
    fontSize: 10,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#333",
  },

  qrAndSealRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    alignItems: "center",
  },
  qrImage: {
    width: 90,
    height: 90,
  },
  sealImage: {
    width: 140,
    height: 60,
    objectFit: "contain",
  },

  finePrint: {
    fontSize: 8,
    textAlign: "center",
    color: "#777",
    marginTop: 18,
  },
});

const format = (d) => {
  if (!d) return "";
  try {
    return d.slice(0, 10);
  } catch {
    return String(d);
  }
};

const CertificateDocument = ({ cert = {}, qr = null, signatureUrl = "/seal.png" }) => {
  // keep watermark repeated to fill page visually
  const watermarkRows = new Array(3).fill(0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark layer */}
        <View style={styles.watermarkContainer} fixed>
          {watermarkRows.map((_, idx) => (
            <Text key={idx} style={styles.watermarkText}>
              Nebsam Digital Solutions
            </Text>
          ))}
        </View>

        {/* Header: centered logo, company name, contact lines, title */}
        <View style={styles.header}>
          <Image src="/logo.png" style={styles.logo} />
          <Text style={styles.companyName}>Nebsam Digital Solutions (K) Ltd</Text>
          <Text style={styles.companyContact}>
            P.O Box: 82436-80100, Mombasa, Kenya · Tel: 0759000111 · info@nebsamdigital.com
          </Text>
          <Text style={styles.certificateTitle}>Certificate of Installation</Text>
        </View>

        {/* Main content with 4 bordered sections */}
        <View style={styles.contentContainer}>
          {/* 1. Certificate Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certificate Details</Text>

            <View style={styles.sectionRow}>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>
                {cert.type === "tracking" ? "Vehicle Tracking Installation" : "Radio Call Ownership"}
              </Text>
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.label}>Serial No:</Text>
              <Text style={styles.value}>{cert.certificateSerialNo || ""}</Text>
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.label}>Date of Issue:</Text>
              <Text style={styles.value}>{format(cert.dateOfIssue)}</Text>
            </View>
          </View>

          {/* 2. Owner Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Owner Details</Text>

            <View style={styles.sectionRow}>
              <Text style={styles.label}>Issued To:</Text>
              <Text style={styles.value}>{cert.issuedTo || ""}</Text>
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.label}>ID Number:</Text>
              <Text style={styles.value}>{cert.idNumber || ""}</Text>
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.label}>Phone Number:</Text>
              <Text style={styles.value}>{cert.phoneNumber || ""}</Text>
            </View>
          </View>

          {/* 3. Vehicle Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Details</Text>

            <View style={styles.sectionRow}>
              <Text style={styles.label}>Registration No:</Text>
              <Text style={styles.value}>{cert.vehicleRegNumber || ""}</Text>
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.label}>Make:</Text>
              <Text style={styles.value}>{cert.make || ""}</Text>
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.label}>Body Type:</Text>
              <Text style={styles.value}>{cert.bodyType || ""}</Text>
            </View>
          </View>

          {/* 4. Device Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Device Details</Text>

            <View style={styles.sectionRow}>
              <Text style={styles.label}>Device Fitted With:</Text>
              <Text style={styles.value}>{cert.deviceFittedWith || ""}</Text>
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.label}>IMEI No:</Text>
              <Text style={styles.value}>{cert.imeiNo || ""}</Text>
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.label}>SIM No:</Text>
              <Text style={styles.value}>{cert.simNo || ""}</Text>
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.label}>Installation Date:</Text>
              <Text style={styles.value}>{format(cert.dateOfInstallation)}</Text>
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.label}>Expiry Date:</Text>
              <Text style={styles.value}>{format(cert.expiryDate)}</Text>
            </View>

            {/* QR + Seal */}
            <View style={styles.qrAndSealRow}>
              {qr ? <Image src={qr} style={styles.qrImage} /> : <View style={{ width: 90 }} />}
              <Image src={signatureUrl} style={styles.sealImage} />
            </View>

            <Text style={styles.fittedBy}>Fitted By: Dennis Karani</Text>
          </View>
        </View>

        {/* Footer fine print */}
        <Text style={styles.finePrint}>
          This is a computer generated certificate — no signature is required.
        </Text>
      </Page>
    </Document>
  );
};

export default CertificateDocument;