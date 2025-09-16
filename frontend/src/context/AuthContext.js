import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.msg || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.msg || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = { user, token, login, register, logout, loading, isAuthenticated: !!token };

  // Set axios default header
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};