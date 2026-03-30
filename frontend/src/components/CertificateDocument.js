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

// ── Font registration ───────────────────────────────────────────────────────
// Lora (serif) for headings and bold labels; Roboto for body text.
Font.register({
  family: "Lora",
  fonts: [
    { src: "/fonts/Lora-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Lora-Bold.ttf", fontWeight: "bold" },
  ],
});
Font.register({ family: "Roboto", src: "/fonts/Roboto-Regular.ttf" });

// ── Design tokens ───────────────────────────────────────────────────────────
const NAVY = "#1B2A4A";
const GOLD = "#C5962A";
const WHITE = "#FFFFFF";


// ── Styles ──────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    backgroundColor: "#F4F1EC",
    fontFamily: "Roboto",
    fontSize: 9,
    color: "#222",
  },

  // Header
  header: {
    backgroundColor: NAVY,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  headerTextWrap: {
    alignItems: "center",
  },
  headerBrand: {
    fontFamily: "Lora",
    fontWeight: "bold",
    fontSize: 26,
    color: WHITE,
    letterSpacing: 3,
  },
  headerTagline: {
    fontFamily: "Roboto",
    fontSize: 9,
    color: GOLD,
    marginTop: 3,
    letterSpacing: 1,
  },

  // Gold divider line
  goldLine: {
    height: 3,
    backgroundColor: GOLD,
  },

  // Title section
  titleSection: {
    backgroundColor: "#FAFAF6",
    paddingTop: 14,
    paddingBottom: 12,
    alignItems: "center",
  },
  certTitle: {
    fontFamily: "Lora",
    fontWeight: "bold",
    fontSize: 22,
    color: NAVY,
    letterSpacing: 1,
  },
  diamondDivider: {
    fontFamily: "Roboto",
    color: GOLD,
    fontSize: 14,
    marginTop: 6,
    letterSpacing: 8,
  },

  // Section wrapper (horizontal margin + bottom spacing)
  sectionWrap: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 8,
  },

  // Section header bar (navy with white text)
  sectionBar: {
    backgroundColor: NAVY,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionBarTitle: {
    fontFamily: "Lora",
    fontWeight: "bold",
    fontSize: 10,
    color: WHITE,
  },
  sectionBarDiamond: {
    fontFamily: "Roboto",
    fontSize: 9,
    color: GOLD,
    marginLeft: 8,
    marginRight: 8,
  },

  // Section content box (bordered)
  sectionBox: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: NAVY,
    backgroundColor: WHITE,
    padding: 10,
  },

  // Field row
  row: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "flex-start",
  },
  label: {
    fontFamily: "Lora",
    fontWeight: "bold",
    fontSize: 8.5,
    color: NAVY,
    width: 85,
    flexShrink: 0,
  },
  colon: {
    fontFamily: "Roboto",
    fontSize: 8.5,
    color: NAVY,
    marginRight: 4,
  },
  value: {
    fontFamily: "Roboto",
    fontSize: 8.5,
    color: "#333",
    flex: 1,
  },
  valueBold: {
    fontFamily: "Lora",
    fontWeight: "bold",
    fontSize: 9,
    color: NAVY,
    flex: 1,
  },

  // Two-column layout
  twoCol: {
    flexDirection: "row",
  },
  colLeft: {
    flex: 1,
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: "#DDD",
  },
  colRight: {
    flex: 1,
    paddingLeft: 10,
  },

  // Certificate Details — right column (company info)
  companyName: {
    fontFamily: "Lora",
    fontWeight: "bold",
    fontSize: 9,
    color: NAVY,
    marginBottom: 4,
  },
  companyDetail: {
    fontFamily: "Roboto",
    fontSize: 7.5,
    color: "#555",
    marginBottom: 2,
  },

  // Serial number box
  serialRow: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
  },
  serialBox: {
    borderWidth: 1,
    borderColor: NAVY,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 6,
    paddingRight: 6,
  },
  serialText: {
    fontFamily: "Lora",
    fontWeight: "bold",
    fontSize: 11,
    color: NAVY,
  },

  // Small QR code inside cert details
  qrSmall: {
    width: 55,
    height: 55,
    marginTop: 6,
  },

  // Highlighted date boxes
  highlightBox: {
    backgroundColor: "#FFF8E1",
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
    flex: 1,
  },
  highlightText: {
    fontFamily: "Lora",
    fontWeight: "bold",
    fontSize: 8.5,
    color: "#7A5800",
  },
  expiryBox: {
    backgroundColor: "#FFE8E8",
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
    flex: 1,
  },
  expiryText: {
    fontFamily: "Lora",
    fontWeight: "bold",
    fontSize: 8.5,
    color: "#B00000",
  },

  // Bottom section
  bottom: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  // Fitted By column
  fittedByCol: {
    width: 120,
    alignItems: "center",
  },
  fittedByLabel: {
    fontFamily: "Roboto",
    fontSize: 8,
    color: "#555",
    marginBottom: 2,
  },
  fittedByName: {
    fontFamily: "Lora",
    fontWeight: "bold",
    fontSize: 10,
    color: NAVY,
    marginBottom: 4,
  },
  signatureImg: {
    width: 85,
    height: 38,
    marginBottom: 4,
  },
  authorizedLabel: {
    fontFamily: "Roboto",
    fontSize: 7.5,
    color: "#666",
    borderTopWidth: 1,
    borderTopColor: "#aaa",
    paddingTop: 2,
    textAlign: "center",
    width: 100,
  },

  // Company stamp column
  stampCol: {
    width: 100,
    alignItems: "center",
  },
  stampBox: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: NAVY,
    width: 88,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  stampText: {
    fontFamily: "Roboto",
    fontSize: 7,
    color: "#999",
    textAlign: "center",
  },

  // Certification badges column
  badgesCol: {
    width: 175,
    alignItems: "center",
  },
  badgesLabel: {
    fontFamily: "Roboto",
    fontSize: 7,
    color: "#666",
    marginBottom: 5,
    textAlign: "center",
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    width: 50,
    height: 50,
    marginLeft: 4,
    marginRight: 4,
  },
  // NTSA styled text placeholder (used when ntsa-badge.png is not available)
  ntsaBadge: {
    width: 50,
    height: 50,
    backgroundColor: NAVY,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
    marginRight: 4,
  },
  ntsaBadgeText: {
    fontFamily: "Lora",
    fontWeight: "bold",
    fontSize: 7,
    color: WHITE,
    textAlign: "center",
  },

  // QR code column
  qrCol: {
    width: 90,
    alignItems: "center",
  },
  qrMain: {
    width: 68,
    height: 68,
  },
  qrLabel: {
    fontFamily: "Roboto",
    fontSize: 6.5,
    color: "#666",
    textAlign: "center",
    marginTop: 3,
  },

  // Footer
  footer: {
    backgroundColor: NAVY,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 12,
  },
  footerText: {
    fontFamily: "Roboto",
    fontSize: 7,
    color: WHITE,
    textAlign: "center",
  },
});

// ── Helper: date formatter ──────────────────────────────────────────────────
const fmt = (d) => (d ? String(d).slice(0, 10) : "\u2014");

// ── Helper: section header bar ──────────────────────────────────────────────
const SectionHeader = ({ title }) => (
  <View style={S.sectionBar}>
    <Text style={S.sectionBarDiamond}>{"\u25C6"}</Text>
    <Text style={S.sectionBarTitle}>{title}</Text>
    <Text style={S.sectionBarDiamond}>{"\u25C6"}</Text>
  </View>
);

// ── Helper: standard field row ──────────────────────────────────────────────
const FieldRow = ({ label, value, bold }) => (
  <View style={S.row}>
    <Text style={S.label}>{label}</Text>
    <Text style={S.colon}>:</Text>
    <Text style={bold ? S.valueBold : S.value}>{value || "\u2014"}</Text>
  </View>
);

// ── Main component ──────────────────────────────────────────────────────────
// NOTE: The following image files must be placed in frontend/public/assets/:
//   - signature.png   (authorized installer signature)
//   - kebs-badge.png  (KEBS Standardization Mark)
//   - odpc-badge.png  (Office of the Data Protection Commissioner)
// See frontend/public/assets/README.md for details.
const CertificateDocument = ({ cert = {}, qr = null }) => {
  const isTracking = cert.type === "tracking";

  return (
    <Document>
      <Page size="A4" style={S.page}>

        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <View style={S.header}>
          <Image style={S.logo} src="/nebsam_logo.png" />
          <View style={S.headerTextWrap}>
            <Text style={S.headerBrand}>NEBSAM</Text>
            <Text style={S.headerTagline}>We Are The Solutions</Text>
          </View>
        </View>

        {/* Gold divider */}
        <View style={S.goldLine} />

        {/* ── TITLE ──────────────────────────────────────────────────── */}
        <View style={S.titleSection}>
          <Text style={S.certTitle}>Certificate of Installation</Text>
          <Text style={S.diamondDivider}>{"\u25C6 \u25C6 \u25C6"}</Text>
        </View>

        {/* Gold divider */}
        <View style={S.goldLine} />

        {/* ── CERTIFICATE DETAILS ────────────────────────────────────── */}
        <View style={S.sectionWrap}>
          <SectionHeader title="Certificate Details" />
          <View style={S.sectionBox}>
            <View style={S.twoCol}>
              {/* Left: type, serial, date */}
              <View style={S.colLeft}>
                <FieldRow
                  label="Type"
                  value={isTracking ? "Vehicle Tracking Installation" : "Radio Call Ownership"}
                />
                <View style={S.serialRow}>
                  <Text style={S.label}>Serial No</Text>
                  <Text style={S.colon}>:</Text>
                  <View style={S.serialBox}>
                    <Text style={S.serialText}>{cert.certificateSerialNo || "\u2014"}</Text>
                  </View>
                </View>
                <FieldRow label="Date of Issue" value={fmt(cert.dateOfIssue)} />
              </View>

              {/* Right: company info + small QR */}
              <View style={S.colRight}>
                <Text style={S.companyName}>Nebsam Digital Solutions (K) Ltd</Text>
                <Text style={S.companyDetail}>HQ-MSA Makupa Roundabout Nxt To Mass Petrol Station</Text>
                <Text style={S.companyDetail}>info@nebsamdigital.com</Text>
                <Text style={S.companyDetail}>www.nebsamdigital.com</Text>
                {qr && <Image style={S.qrSmall} src={qr} />}
              </View>
            </View>
          </View>
        </View>

        {/* ── OWNER DETAILS ──────────────────────────────────────────── */}
        <View style={S.sectionWrap}>
          <SectionHeader title="Owner Details" />
          <View style={S.sectionBox}>
            <FieldRow label="Issued To" value={cert.issuedTo} />
            <FieldRow label="ID Number" value={cert.idNumber} />
            <FieldRow label="Phone Number" value={cert.phoneNumber} />
          </View>
        </View>

        {/* ── VEHICLE DETAILS ────────────────────────────────────────── */}
        <View style={S.sectionWrap}>
          <SectionHeader title="Vehicle Details" />
          <View style={S.sectionBox}>
            <View style={S.twoCol}>
              {/* Left: registration, make, body type */}
              <View style={S.colLeft}>
                <FieldRow label="Registration No" value={cert.vehicleRegNumber} bold />
                <FieldRow label="Make" value={cert.make} />
                <FieldRow label="Body Type" value={cert.bodyType} />
              </View>

              {/* Right: device, IMEI, SIM, dates */}
              <View style={S.colRight}>
                <FieldRow label="Device Fitted" value={cert.deviceFittedWith} bold />
                <FieldRow label="IMEI No" value={cert.imeiNo} />
                <FieldRow label="SIM No" value={cert.simNo} />
                <View style={S.row}>
                  <Text style={S.label}>Install Date</Text>
                  <Text style={S.colon}>:</Text>
                  <View style={S.highlightBox}>
                    <Text style={S.highlightText}>{fmt(cert.dateOfInstallation)}</Text>
                  </View>
                </View>
                <View style={S.row}>
                  <Text style={S.label}>Expiry Date</Text>
                  <Text style={S.colon}>:</Text>
                  <View style={S.expiryBox}>
                    <Text style={S.expiryText}>{fmt(cert.expiryDate)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── BOTTOM SECTION ─────────────────────────────────────────── */}
        <View style={S.bottom}>
          {/* Fitted By + Signature */}
          <View style={S.fittedByCol}>
            <Text style={S.fittedByLabel}>Fitted By:</Text>
            <Text style={S.fittedByName}>Dennis Karani</Text>
            <Image style={S.signatureImg} src="/assets/signature.png" />
            <Text style={S.authorizedLabel}>Authorized Installer</Text>
          </View>

          {/* Official Company Stamp */}
          <View style={S.stampCol}>
            <View style={S.stampBox}>
              <Text style={S.stampText}>Official{"\n"}Company{"\n"}Stamp</Text>
            </View>
          </View>

          {/* Certification badges */}
          <View style={S.badgesCol}>
            <Text style={S.badgesLabel}>Certified By:</Text>
            <View style={S.badgesRow}>
              {/* NTSA: styled placeholder (replace with Image when ntsa-badge.png is available) */}
      
              <Image style={S.badge} src="/assets/kebs-badge.png" />
              <Image style={S.badge} src="/assets/odpc-badge.png" />
              <Image style={S.badge} src="/assets/cak-badge.png" />
            </View>
          </View>

          {/* QR code */}
          <View style={S.qrCol}>
            {qr && (
              <>
                <Image style={S.qrMain} src={qr} />
                <Text style={S.qrLabel}>Scan to Verify{"\n"}Certificate</Text>
              </>
            )}
          </View>
        </View>

        {/* ── FOOTER ─────────────────────────────────────────────────── */}
        <View style={S.footer}>
          <Text style={S.footerText}>
            This is a computer-generated certificate issued by Nebsam Digital Solutions (K) Ltd.
            {"\n"}No signature is required.
          </Text>
        </View>

      </Page>
    </Document>
  );
};

export default CertificateDocument;
