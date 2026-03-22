import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Blocks non-vendor users from accessing /vendor/* routes.
// Readers get redirected to /dashboard.
// Shows nothing while auth is still loading.
const VendorRoute: React.FC = () => {
  const { user, loading, isVendor } = useAuth();

  if (loading) return null;
  if (!user)       return <Navigate to="/login"     replace />;
  if (!isVendor)   return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default VendorRoute;