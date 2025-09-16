import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const schema = Yup.object().shape({
  companyName: Yup.string().required("Required"),
  radioLicenseNumber: Yup.string().required("Required"),
  deviceId: Yup.string().required("Required"),
  model: Yup.string().required("Required"),
  issuedTo: Yup.string().required("Required"),
});

const CertificateNewRadio = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/certificates", { ...data, type: "radio" });
      navigate(`/certificates/${res.data._id}/preview`);
    } catch (err) {
      alert(err.response?.data?.msg || "Submission error");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={5} p={3}>
      <Typography variant="h5" mb={2}>New Radio Call Certificate of Ownership</Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller name="companyName" control={control} render={({ field }) => (
              <TextField label="Company Name" fullWidth {...field} error={!!errors.companyName} helperText={errors.companyName?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="radioLicenseNumber" control={control} render={({ field }) => (
              <TextField label="Radio License Number" fullWidth {...field} error={!!errors.radioLicenseNumber} helperText={errors.radioLicenseNumber?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="deviceId" control={control} render={({ field }) => (
              <TextField label="Device ID" fullWidth {...field} error={!!errors.deviceId} helperText={errors.deviceId?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="model" control={control} render={({ field }) => (
              <TextField label="Model" fullWidth {...field} error={!!errors.model} helperText={errors.model?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="issuedTo" control={control} render={({ field }) => (
              <TextField label="Issued To (Rep Name)" fullWidth {...field} error={!!errors.issuedTo} helperText={errors.issuedTo?.message} />
            )} />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>Preview Certificate</Button>
      </form>
    </Box>
  );
};

export default CertificateNewRadio;