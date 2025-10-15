import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_BASE = process.env.REACT_APP_API_BASE;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);

  // Persist user and token in localStorage
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  // OTP login flow
  const requestOtp = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login/request-otp`, { email, password });
      return { success: true, msg: res.data.msg };
    } catch (err) {
      return { success: false, message: err.response?.data?.msg || "OTP request failed" };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login/verify-otp`, { email, otp });
      setUser(res.data.user);
      setToken(res.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.msg || "OTP verification failed" };
    } finally {
      setLoading(false);
    }
  };

  // Registration
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, { name, email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.msg || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Ensure Authorization header is set for all requests
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
  }, [token]);

  const value = {
    user,
    token,
    requestOtp,    // Use this for OTP request
    verifyOtp,     // Use this for OTP verification
    register,
    logout,
    loading,
    isAuthenticated: !!token,
    setUser,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};