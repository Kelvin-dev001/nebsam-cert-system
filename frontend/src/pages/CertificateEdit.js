import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Alert,
  Snackbar,
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

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

const CertificateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      vehicleRegNumber: "",
      make: "",
      bodyType: "",
      chassisNumber: "",
      deviceFittedWith: "",
      imeiNo: "",
      simNo: "",
      dateOfInstallation: "",
      expiryDate: "",
      issuedTo: "",
      idNumber: "",
      phoneNumber: "",
    }
  });

  // Fetch certificate data
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/api/certificates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setCert(res.data);
        // Reset form with fetched certificate data
        reset({
          vehicleRegNumber: res.data.vehicleRegNumber || "",
          make: res.data.make || "",
          bodyType: res.data.bodyType || "",
          chassisNumber: res.data.chassisNumber || "",
          deviceFittedWith: res.data.deviceFittedWith || "",
          imeiNo: res.data.imeiNo || "",
          simNo: res.data.simNo || "",
          dateOfInstallation: res.data.dateOfInstallation?.slice(0,10) || "",
          expiryDate: res.data.expiryDate?.slice(0,10) || "",
          issuedTo: res.data.issuedTo || "",
          idNumber: res.data.idNumber || "",
          phoneNumber: res.data.phoneNumber || "",
        });
      })
      .catch(() => setCert(null))
      .finally(() => setLoading(false));
  }, [id, token, reset]);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      await axios.put(
        `${API_BASE}/api/certificates/${id}`,
        { ...data },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSnackbar({
        open: true,
        message: "Certificate updated successfully!",
        severity: "success"
      });
      // Optionally, redirect to preview
      setTimeout(() => navigate(`/certificates/${id}/preview`), 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.msg || "Update error",
        severity: "error"
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading)
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  if (!cert)
    return (
      <Box mt={8}>
        <Typography>Certificate not found.</Typography>
      </Box>
    );

  return (
    <Box maxWidth={600} mx="auto" mt={5} p={3}>
      <Typography variant="h5" mb={2}>Edit Vehicle Tracking Installation Certificate</Typography>
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
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={isSubmitting}>Update Certificate</Button>
      </form>
      <Button variant="outlined" sx={{ mt: 3 }} onClick={() => navigate(`/certificates/${id}/preview`)}>Back to Preview</Button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CertificateEdit;