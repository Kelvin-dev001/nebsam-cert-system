import React, { useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, MenuItem, Box, Typography, Grid } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Full list of vehicle makes
const makes = [
  "Toyota", "Nissan", "Isuzu", "Mazda", "Mitsubishi", "Honda", "Subaru", "Suzuki", "Ford", "Volkswagen",
  "Mercedes-Benz", "BMW", "Chevrolet", "Hyundai", "Kia", "Land Rover", "Peugeot", "Fiat", "Jeep", "Scania", "DAF"
];

// Full list of body types
const bodyTypes = [
  "Pickup", "Lorry", "Saloon", "Station Wagon", "SUV", "Van", "Minibus", "Bus", "Tipper", "Trailer",
  "Concrete Mixer", "Box Truck", "Flatbed", "Tank Truck", "Double Cabin", "Single Cabin"
];

// Updated tracking devices list
const trackingDevices = [
  "Nebsam Fuel Monitor",
  "Nebsam Basic Tracker",
  "Nebsam Magnetic Tracker",
  "Nebsmart Alarm",
  "Nebsam Hybrid Tracker",
  "Nebsam Comprehensive Hybrid Tracker",
  "Nebsam Bluetooth Tracker",
  "Nebsam Bluetooth Tracker Pro",
  "Nebsam Tipper Tracker"
];

const API_BASE = process.env.REACT_APP_API_BASE;

const schema = Yup.object().shape({
  vehicleRegNumber: Yup.string().required("Required"),
  make: Yup.string().required("Required"),
  bodyType: Yup.string().required("Required"),
  chassisNumber: Yup.string().required("Required"),
  deviceFittedWith: Yup.string().required("Required"),
  imeiNo: Yup.string().required("Required"),
  simNo: Yup.string().required("Required"),
  dateOfInstallation: Yup.date().required("Required"),
  expiryDate: Yup.date().required("Required"),
  issuedTo: Yup.string().required("Required"),
  idNumber: Yup.string().required("Required"),
  phoneNumber: Yup.string().required("Required"),
});

const CertificateNewTracking = () => {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext); // Make sure user is included
  const { control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/certificates`,
        {
          ...data,
          type: "tracking"
          
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate(`/certificates/${res.data._id}/preview`);
    } catch (err) {
      alert(err.response?.data?.msg || "Submission error");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={5} p={3}>
      <Typography variant="h5" mb={2}>New Vehicle Tracking Installation Certificate</Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller name="vehicleRegNumber" control={control} render={({ field }) => (
              <TextField label="Vehicle Reg Number" fullWidth {...field} error={!!errors.vehicleRegNumber} helperText={errors.vehicleRegNumber?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="make" control={control} render={({ field }) => (
              <TextField
                label="Make"
                select
                fullWidth
                variant="outlined"
                {...field}
                error={!!errors.make}
                helperText={errors.make?.message}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value=""><em>Select Make</em></MenuItem>
                {makes.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="bodyType" control={control} render={({ field }) => (
              <TextField
                label="Body Type"
                select
                fullWidth
                variant="outlined"
                {...field}
                error={!!errors.bodyType}
                helperText={errors.bodyType?.message}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value=""><em>Select Body Type</em></MenuItem>
                {bodyTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
              </TextField>
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="chassisNumber" control={control} render={({ field }) => (
              <TextField label="Chassis Number" fullWidth {...field} error={!!errors.chassisNumber} helperText={errors.chassisNumber?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="deviceFittedWith" control={control} render={({ field }) => (
              <TextField
                label="Device Fitted With"
                select
                fullWidth
                variant="outlined"
                {...field}
                error={!!errors.deviceFittedWith}
                helperText={errors.deviceFittedWith?.message}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value=""><em>Select Device</em></MenuItem>
                {trackingDevices.map((dev) => <MenuItem key={dev} value={dev}>{dev}</MenuItem>)}
              </TextField>
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="imeiNo" control={control} render={({ field }) => (
              <TextField label="IMEI No" fullWidth {...field} error={!!errors.imeiNo} helperText={errors.imeiNo?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="simNo" control={control} render={({ field }) => (
              <TextField label="SIM No" fullWidth {...field} error={!!errors.simNo} helperText={errors.simNo?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="dateOfInstallation" control={control} render={({ field }) => (
              <TextField label="Date of Installation" type="date" fullWidth {...field} InputLabelProps={{ shrink: true }} error={!!errors.dateOfInstallation} helperText={errors.dateOfInstallation?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="expiryDate" control={control} render={({ field }) => (
              <TextField label="Expiry Date" type="date" fullWidth {...field} InputLabelProps={{ shrink: true }} error={!!errors.expiryDate} helperText={errors.expiryDate?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="issuedTo" control={control} render={({ field }) => (
              <TextField label="Issued To (Customer Name)" fullWidth {...field} error={!!errors.issuedTo} helperText={errors.issuedTo?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="idNumber" control={control} render={({ field }) => (
              <TextField label="ID Number" fullWidth {...field} error={!!errors.idNumber} helperText={errors.idNumber?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="phoneNumber" control={control} render={({ field }) => (
              <TextField label="Phone Number" fullWidth {...field} error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} />
            )} />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>Preview Certificate</Button>
      </form>
    </Box>
  );
};

export default CertificateNewTracking;