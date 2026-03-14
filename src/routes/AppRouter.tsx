import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import LandingPage from '../pages/LandingPage';
import { ThemeProvider } from '../context/ThemeContext';

const AppRouter: React.FC = () => (
  <BrowserRouter>
  <ThemeProvider>
      <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LandingPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  </ThemeProvider>
  
  </BrowserRouter>
);

export default AppRouter;