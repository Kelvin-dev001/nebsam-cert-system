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

const DARK_BLUE = "#003366";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 0,
    fontFamily: "Roboto",
    fontSize: 9,
    color: "#222",
    position: "relative",
    minHeight: "100%",
  },
  pageBorder: {
    position: "absolute",
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    border: `1.6pt solid ${DARK_BLUE}`,
    borderRadius: 10,
    zIndex: 100,
  },
  watermarkGrid: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    opacity: 0.16,
    zIndex: 0,
    flexDirection: "column",
    justifyContent: "space-between",
    pointerEvents: "none",
  },
  watermarkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 0,
    marginRight: 0,
  },
  watermarkText: {
    fontSize: 7,
    color: DARK_BLUE,
    fontFamily: "Lora-Bold",
    marginRight: 1,
    marginBottom: 1,
    fontWeight: "bold",
    transform: "rotate(-30deg)",
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 3,
    zIndex: 2,
    width: "92%",
    alignSelf: "center",
  },
  logo: {
    width: 38,
    height: 38,
    marginBottom: 2,
    marginRight: 8,
  },
  qrImage: {
    width: 34,
    height: 34,
    marginTop: 3,
    marginLeft: "auto",
    alignSelf: "flex-start",
  },
  headerTextBlock: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
    marginRight: 2,
  },
  companyName: {
    fontSize: 11,
    fontFamily: "Lora-Bold",
    fontWeight: "bold",
    textAlign: "center",
    color: DARK_BLUE,
    marginBottom: 1,
  },
  companyContact: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 1,
  },
  certificateTitle: {
    fontSize: 10,
    fontFamily: "Lora",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    textDecoration: "underline",
    color: DARK_BLUE,
  },
  section: {
    borderRadius: 5,
    border: "0.7pt solid #c7d7eb",
    padding: 6,
    marginBottom: 6,
    backgroundColor: "#f7fbff",
    width: "92%",
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 8.7,
    fontFamily: "Lora",
    fontWeight: "bold",
    color: DARK_BLUE,
    marginBottom: 6,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  fieldRow: {
    marginBottom: 7,
  },
  label: {
    fontWeight: "bold",
    fontSize: 8,
    color: DARK_BLUE,
    fontFamily: "Lora-Bold",
    marginBottom: 0,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 9,
    color: "#222",
    fontFamily: "Roboto",
    marginBottom: 0,
    fontWeight: "bold",
    letterSpacing: 0.1,
    textAlign: "left",
  },
  dottedLine: {
    borderBottomWidth: 0.6,
    borderBottomStyle: "dashed",
    borderBottomColor: DARK_BLUE,
    marginTop: 1,
    marginBottom: 0,
    width: "100%",
  },
  fittedBy: {
    marginTop: 7,
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  finePrint: {
    fontSize: 7,
    textAlign: "center",
    color: "#777",
    marginTop: 7,
    fontFamily: "Roboto",
    marginBottom: 1,
    alignSelf: "center",
  },
});

const format = d => (d ? d.slice(0, 10) : "");

const CertificateDocument = ({ cert = {}, qr = null }) => {
  const watermarkRowsCount = 72;
  const watermarkColsCount = 26;
  const watermarkRowText = Array(watermarkColsCount).fill("Nebsam Digital Solutions");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Border */}
        <View style={styles.pageBorder} fixed />

        {/* Watermark grid */}
        <View style={styles.watermarkGrid} fixed>
          {Array(watermarkRowsCount).fill(0).map((_, rowIdx) => (
            <View style={styles.watermarkRow} key={rowIdx}>
              {watermarkRowText.map((text, colIdx) => (
                <Text style={styles.watermarkText} key={colIdx + "_wm"}>
                  {text}
                </Text>
              ))}
            </View>
          ))}
        </View>

        {/* Header: logo (left), text (center), qr (right) */}
        <View style={styles.header}>
          <Image src="/logo.png" style={styles.logo} />
          <View style={styles.headerTextBlock}>
            <Text style={styles.companyName}>Nebsam Digital Solutions (K) Ltd</Text>
            <Text style={styles.companyContact}>
              P.O Box: 82436-80100, Mombasa, Kenya · Tel: 0759000111 · info@nebsamdigital.com
            </Text>
            <Text style={styles.certificateTitle}>Certificate of Installation</Text>
          </View>
          {qr && <Image src={qr} style={styles.qrImage} />}
        </View>

        {/* Certificate Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certificate Details</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>{cert.type === "tracking" ? "Vehicle Tracking Installation" : "Radio Call Ownership"}</Text>
            <View style={styles.dottedLine} />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Serial No:</Text>
            <Text style={styles.value}>{cert.certificateSerialNo || ""}</Text>
            <View style={styles.dottedLine} />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date of Issue:</Text>
            <Text style={styles.value}>{format(cert.dateOfIssue)}</Text>
            <View style={styles.dottedLine} />
          </View>
        </View>
        {/* Owner Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owner Details</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Issued To:</Text>
            <Text style={styles.value}>{cert.issuedTo || ""}</Text>
            <View style={styles.dottedLine} />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>ID Number:</Text>
            <Text style={styles.value}>{cert.idNumber || ""}</Text>
            <View style={styles.dottedLine} />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{cert.phoneNumber || ""}</Text>
            <View style={styles.dottedLine} />
          </View>
        </View>
        {/* Vehicle Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Details</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Registration No:</Text>
            <Text style={styles.value}>{cert.vehicleRegNumber || ""}</Text>
            <View style={styles.dottedLine} />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Make:</Text>
            <Text style={styles.value}>{cert.make || ""}</Text>
            <View style={styles.dottedLine} />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Body Type:</Text>
            <Text style={styles.value}>{cert.bodyType || ""}</Text>
            <View style={styles.dottedLine} />
          </View>
        </View>
        {/* Device Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Details</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Device Fitted With:</Text>
            <Text style={styles.value}>{cert.deviceFittedWith || ""}</Text>
            <View style={styles.dottedLine} />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>IMEI No:</Text>
            <Text style={styles.value}>{cert.imeiNo || ""}</Text>
            <View style={styles.dottedLine} />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>SIM No:</Text>
            <Text style={styles.value}>{cert.simNo || ""}</Text>
            <View style={styles.dottedLine} />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Installation Date:</Text>
            <Text style={styles.value}>{format(cert.dateOfInstallation)}</Text>
            <View style={styles.dottedLine} />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Expiry Date:</Text>
            <Text style={styles.value}>{format(cert.expiryDate)}</Text>
            <View style={styles.dottedLine} />
          </View>
          <Text style={styles.fittedBy}>Fitted By: Dennis Karani</Text>
        </View>
        <Text style={styles.finePrint}>
          This is a computer generated certificate — no signature is required.
        </Text>
      </Page>
    </Document>
  );
};

export default CertificateDocument;