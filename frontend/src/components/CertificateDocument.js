import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// ADD your logo file to public/logo.png or src/assets/logo.png and adjust path below!
// PDFKit doesn't use public folder, but @react-pdf/renderer does.

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 30,
    fontFamily: "Helvetica",
    position: "relative",
  },
  watermark: {
    position: "absolute",
    top: 200,
    left: 60,
    fontSize: 60,
    color: "#cccccc",
    opacity: 0.13,
    rotate: "15deg",
    zIndex: 0,
  },
  logo: {
    width: 100,
    margin: "0 auto",
    alignSelf: "center",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 2,
  },
  certificateTitle: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    textDecoration: "underline",
  },
  section: {
    border: "1pt solid #222",
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    backgroundColor: "#fafafa",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "left",
    color: "#0a5297",
  },
  fieldRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 4,
  },
  fieldLabel: {
    width: 140,
    fontWeight: "bold",
    fontSize: 11,
    color: "#555",
  },
  fieldValue: {
    fontSize: 11,
    color: "#111",
    flex: 1,
  },
  fittedBy: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "left",
    color: "#666",
  },
  finePrint: {
    fontSize: 8,
    textAlign: "center",
    color: "#888",
    marginTop: 18,
  },
});

const CertificateDocument = ({ cert }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Watermark */}
      <Text style={styles.watermark}>Nebsam Digital Solutions</Text>

      {/* Logo */}
      <Image src="/logo.png" style={styles.logo} />
      <Text style={styles.companyName}>Nebsam Digital Solutions (K) Ltd</Text>
      <Text style={styles.certificateTitle}>Certificate of Installation</Text>

      {/* Certificate Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certificate Details</Text>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Type:</Text>
          <Text style={styles.fieldValue}>
            {cert.type === "tracking"
              ? "Vehicle Tracking Installation"
              : "Radio Call Ownership"}
          </Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Serial No:</Text>
          <Text style={styles.fieldValue}>{cert.certificateSerialNo}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Date of Issue:</Text>
          <Text style={styles.fieldValue}>
            {cert.dateOfIssue?.slice(0, 10)}
          </Text>
        </View>
      </View>

      {/* Owner Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Owner Details</Text>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Issued To:</Text>
          <Text style={styles.fieldValue}>{cert.issuedTo}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>ID Number:</Text>
          <Text style={styles.fieldValue}>{cert.idNumber}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Phone Number:</Text>
          <Text style={styles.fieldValue}>{cert.phoneNumber}</Text>
        </View>
      </View>

      {/* Vehicle Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Details</Text>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Reg Number:</Text>
          <Text style={styles.fieldValue}>{cert.vehicleRegNumber}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Make:</Text>
          <Text style={styles.fieldValue}>{cert.make}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Body Type:</Text>
          <Text style={styles.fieldValue}>{cert.bodyType}</Text>
        </View>
      </View>

      {/* Device Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Details</Text>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Device Fitted With:</Text>
          <Text style={styles.fieldValue}>{cert.deviceFittedWith}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>IMEI No:</Text>
          <Text style={styles.fieldValue}>{cert.imeiNo}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>SIM No:</Text>
          <Text style={styles.fieldValue}>{cert.simNo}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Installation Date:</Text>
          <Text style={styles.fieldValue}>
            {cert.dateOfInstallation?.slice(0, 10)}
          </Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Expiry Date:</Text>
          <Text style={styles.fieldValue}>{cert.expiryDate?.slice(0, 10)}</Text>
        </View>
        <Text style={styles.fittedBy}>Fitted By: Dennis Karani</Text>
      </View>

      {/* Fine Print */}
      <Text style={styles.finePrint}>
        This is a computer generated certificate no signature is required.
      </Text>
    </Page>
  </Document>
);

export default CertificateDocument;