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

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 18,
    fontFamily: "Roboto",
    position: "relative",
    fontSize: 9.2,
    color: "#222",
    minHeight: "100%",
  },
  pageBorder: {
    position: "absolute",
    top: 6,
    left: 6,
    right: 6,
    bottom: 6,
    border: "2pt solid #0a4b7a",
    borderRadius: 12,
    zIndex: 99,
  },
  // Watermark grid, denser and smaller
  watermarkGrid: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
    left: 0,
    top: 0,
    opacity: 0.12,
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
    fontSize: 6,
    color: "#0a4b7a",
    fontFamily: "Lora",
    marginRight: 2,
    marginBottom: 2,
    fontWeight: "bold",
    transform: "rotate(-30deg)",
    letterSpacing: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 3,
    zIndex: 2,
  },
  logo: {
    width: 70,
    height: "auto",
    marginBottom: 2,
  },
  companyName: {
    fontSize: 12,
    fontFamily: "Lora-Bold",
    fontWeight: "bold",
    textAlign: "center",
    color: "#0a4b7a",
    marginBottom: 1,
  },
  companyContact: {
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 2,
  },
  certificateTitle: {
    fontSize: 11,
    fontFamily: "Lora",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    textDecoration: "underline",
    color: "#0a4b7a",
  },
  // Section styles
  section: {
    borderRadius: 6,
    padding: 4,
    marginBottom: 4,
    backgroundColor: "#f5f9ff",
    border: "1pt solid #eee",
  },
  sectionTitle: {
    fontSize: 8.5,
    fontFamily: "Lora",
    fontWeight: "bold",
    color: "#0a4b7a",
    marginBottom: 2,
    textAlign: "center",
  },
  // Horizontal grid for section fields
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 2,
    gap: 2,
  },
  fieldBlock: {
    flex: 1,
    marginRight: 2,
    minWidth: 68,
    maxWidth: 100,
  },
  label: {
    fontWeight: "bold",
    fontSize: 7.5,
    color: "#333",
    fontFamily: "Roboto",
    marginBottom: 0,
  },
  value: {
    fontSize: 8.5,
    color: "#0a4b7a",
    fontFamily: "Lora-Bold",
    marginBottom: 0,
    fontWeight: "bold",
    letterSpacing: 0.1,
    textAlign: "left",
  },
  dottedLine: {
    borderBottom: "0.8pt dotted #0a4b7a",
    marginTop: -2,
    marginBottom: 2,
    width: "100%",
  },
  qrAndSealRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    alignItems: "center",
  },
  qrImage: {
    width: 43,
    height: 43,
  },
  sealImage: {
    width: 70,
    height: 26,
    objectFit: "contain",
  },
  fittedBy: {
    marginTop: 1,
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#333",
  },
  finePrint: {
    fontSize: 7,
    textAlign: "center",
    color: "#777",
    marginTop: 3,
    fontFamily: "Roboto",
    marginBottom: 2,
  },
});

const format = d => (d ? d.slice(0, 10) : "");

const CertificateDocument = ({ cert = {}, qr = null, signatureUrl = "/seal.png" }) => {
  // Watermark grid: fill page with rows of watermarks, dense
  const watermarkRowsCount = 45; // denser
  const watermarkColsCount = 12; // denser
  const watermarkRowText = Array(watermarkColsCount).fill("Nebsam Digital Solutions");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Overall page border */}
        <View style={styles.pageBorder} fixed />

        {/* Watermark grid (fills entire background) */}
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

        {/* Certificate content (above watermark, inside border) */}
        <View style={styles.header}>
          <Image src="/logo.png" style={styles.logo} />
          <Text style={styles.companyName}>Nebsam Digital Solutions (K) Ltd</Text>
          <Text style={styles.companyContact}>
            P.O Box: 82436-80100, Mombasa, Kenya · Tel: 0759000111 · info@nebsamdigital.com
          </Text>
          <Text style={styles.certificateTitle}>Certificate of Installation</Text>
        </View>

        {/* Certificate Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certificate Details</Text>
          <View style={styles.row}>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>{cert.type === "tracking" ? "Vehicle Tracking Installation" : "Radio Call Ownership"}</Text>
              <View style={styles.dottedLine} />
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Serial No:</Text>
              <Text style={styles.value}>{cert.certificateSerialNo || ""}</Text>
              <View style={styles.dottedLine} />
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Date of Issue:</Text>
              <Text style={styles.value}>{format(cert.dateOfIssue)}</Text>
              <View style={styles.dottedLine} />
            </View>
          </View>
        </View>
        
        {/* Owner Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owner Details</Text>
          <View style={styles.row}>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Issued To:</Text>
              <Text style={styles.value}>{cert.issuedTo || ""}</Text>
              <View style={styles.dottedLine} />
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>ID Number:</Text>
              <Text style={styles.value}>{cert.idNumber || ""}</Text>
              <View style={styles.dottedLine} />
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Phone Number:</Text>
              <Text style={styles.value}>{cert.phoneNumber || ""}</Text>
              <View style={styles.dottedLine} />
            </View>
          </View>
        </View>

        {/* Vehicle Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Details</Text>
          <View style={styles.row}>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Registration No:</Text>
              <Text style={styles.value}>{cert.vehicleRegNumber || ""}</Text>
              <View style={styles.dottedLine} />
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Make:</Text>
              <Text style={styles.value}>{cert.make || ""}</Text>
              <View style={styles.dottedLine} />
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Body Type:</Text>
              <Text style={styles.value}>{cert.bodyType || ""}</Text>
              <View style={styles.dottedLine} />
            </View>
          </View>
        </View>

        {/* Device Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Details</Text>
          <View style={styles.row}>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Device Fitted With:</Text>
              <Text style={styles.value}>{cert.deviceFittedWith || ""}</Text>
              <View style={styles.dottedLine} />
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>IMEI No:</Text>
              <Text style={styles.value}>{cert.imeiNo || ""}</Text>
              <View style={styles.dottedLine} />
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>SIM No:</Text>
              <Text style={styles.value}>{cert.simNo || ""}</Text>
              <View style={styles.dottedLine} />
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Installation Date:</Text>
              <Text style={styles.value}>{format(cert.dateOfInstallation)}</Text>
              <View style={styles.dottedLine} />
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Expiry Date:</Text>
              <Text style={styles.value}>{format(cert.expiryDate)}</Text>
              <View style={styles.dottedLine} />
            </View>
          </View>
          {/* QR/Seal row (squeezed to fit) */}
          <View style={styles.qrAndSealRow}>
            {qr ? <Image src={qr} style={styles.qrImage} /> : <View style={{ width: 43 }} />}
            <Image src={signatureUrl} style={styles.sealImage} />
          </View>
          <Text style={styles.fittedBy}>Fitted By: Dennis Karani</Text>
        </View>
        {/* Fine print */}
        <Text style={styles.finePrint}>
          This is a computer generated certificate — no signature is required.
        </Text>
      </Page>
    </Document>
  );
};

export default CertificateDocument;