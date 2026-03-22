import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../dashboard/Navbar/Navbar';

const DashboardLayout: React.FC = () => (
  <>
    <Navbar />
    <div style={{ paddingTop: '70px' }}>
      <Outlet />
    </div>
  </>
);

export default DashboardLayout;