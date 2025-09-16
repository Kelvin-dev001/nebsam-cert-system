import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

const CertificateShare = () => {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/certificates/${id}`)
      .then(res => setCert(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEmailSend = () => {
    // Implement with EmailJS or your backend email API
    alert(`Send certificate PDF to: ${email} (not implemented)`);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Here is your certificate (Serial No: ${cert?.certificateSerialNo}).`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handlePrint = () => {
    window.print(); // For demo, use @react-pdf/renderer for real PDFs
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!cert) return <Typography>Certificate not found.</Typography>;

  return (
    <Box maxWidth={600} mx="auto" mt={5} p={3}>
      <Typography variant="h5" mb={2}>Share Certificate</Typography>
      <Stack spacing={2}>
        <TextField label="Recipient Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Button variant="contained" color="primary" onClick={handleEmailSend}>Send by Email</Button>
        <Button variant="contained" color="success" onClick={handleWhatsAppShare}>Share via WhatsApp</Button>
        <Button variant="outlined" onClick={handlePrint}>Print</Button>
      </Stack>
    </Box>
  );
};

export default CertificateShare;