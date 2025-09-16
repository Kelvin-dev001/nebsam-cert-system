import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";

const schema = Yup.object().shape({
  name: Yup.string().required("Name required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password required"),
});

const Register = () => {
  const { register: registerUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const res = await registerUser(data.name, data.email, data.password);
    if (res.success) navigate("/dashboard");
    else alert(res.message);
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} borderRadius={2} boxShadow={3}>
      <Typography variant="h5" mb={2}>Register</Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField label="Name" fullWidth margin="normal" {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
        <TextField label="Email" fullWidth margin="normal" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
        <TextField label="Password" type="password" fullWidth margin="normal" {...register("password")} error={!!errors.password} helperText={errors.password?.message} />
        <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }}>
          {loading ? <CircularProgress size={24} /> : "Register"}
        </Button>
        <Typography variant="body2" mt={2}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </form>
    </Box>
  );
};

export default Register;