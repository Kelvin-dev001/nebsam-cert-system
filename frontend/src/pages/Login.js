import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().required("Password required"),
});

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP required")
    .length(6, "OTP must be 6 digits"),
});

const Login = () => {
  // Get OTP login functions from context
  const { requestOtp, verifyOtp, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // Step 1: email & password
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm({ resolver: yupResolver(schema) });

  // Step 2: OTP
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
  } = useForm({ resolver: yupResolver(otpSchema) });

  // Step 1 handler: Request OTP
  const onSubmitLogin = async (data) => {
    setError('');
    const normalizedEmail = data.email.trim().toLowerCase();
    const res = await requestOtp(normalizedEmail, data.password);
    if (res.success) {
      setLoginData({ email: normalizedEmail, password: data.password });
      setStep(2);
    } else {
      setError(res.message || "Login error");
    }
  };

  // Step 2 handler: Verify OTP
  const onSubmitOtp = async (data) => {
    setError('');
    const normalizedEmail = loginData.email.trim().toLowerCase();
    const normalizedOtp = String(data.otp).trim();
    const res = await verifyOtp(normalizedEmail, normalizedOtp);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message || "OTP verification error");
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} borderRadius={2} boxShadow={3}>
      <Typography variant="h5" mb={2}>Login</Typography>
      {step === 1 ? (
        <form onSubmit={handleSubmitLogin(onSubmitLogin)} noValidate>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...registerLogin("email")}
            error={!!loginErrors.email}
            helperText={loginErrors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...registerLogin("password")}
            error={!!loginErrors.password}
            helperText={loginErrors.password?.message}
          />
          {error && <Typography color="error" mt={1}>{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }}>
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
          <Typography variant="body2" mt={2}>
            Don't have an account? <Link to="/register">Register</Link>
          </Typography>
        </form>
      ) : (
        <form onSubmit={handleSubmitOtp(onSubmitOtp)} noValidate>
          <Typography mt={2} mb={2}>
            OTP has been sent to admin numbers.<br />
            Please request OTP from admin and enter it below.
          </Typography>
          <TextField
            label="OTP"
            fullWidth
            margin="normal"
            {...registerOtp("otp")}
            error={!!otpErrors.otp}
            helperText={otpErrors.otp?.message}
          />
          {error && <Typography color="error" mt={1}>{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }}>
            {loading ? <CircularProgress size={24} /> : "Verify OTP & Login"}
          </Button>
          <Button
            fullWidth
            variant="text"
            color="secondary"
            sx={{ mt: 1 }}
            onClick={() => setStep(1)}
            disabled={loading}
          >
            Back to Login
          </Button>
        </form>
      )}
    </Box>
  );
};

export default Login;