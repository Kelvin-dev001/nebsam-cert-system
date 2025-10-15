import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CertificateNewTracking from "./pages/CertificateNewTracking";
import CertificateNewRadio from "./pages/CertificateNewRadio";
import CertificatePreview from "./pages/CertificatePreview";
import CertificateShare from "./pages/CertificateShare";
import CertificateHistory from "./pages/CertificateHistory";
import AppBar from "./components/AppBar";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppBar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/certificates/new-tracking" 
            element={
              <ProtectedRoute>
                <CertificateNewTracking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/certificates/new-radio" 
            element={
              <ProtectedRoute>
                <CertificateNewRadio />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/certificates/:id/preview" 
            element={
              <ProtectedRoute>
                <CertificatePreview />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/certificates/:id/share" 
            element={
              <ProtectedRoute>
                <CertificateShare />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/certificates/history" 
            element={
              <ProtectedRoute>
                <CertificateHistory />
              </ProtectedRoute>
            } 
          />
          <Route
  path="/certificates/:id/edit"
  element={
    <ProtectedRoute>
      <CertificateEdit />
    </ProtectedRoute>
  }
/>
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;