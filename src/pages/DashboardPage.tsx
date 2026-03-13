import React from 'react';
import Navbar from '../components/dashboard/Navbar';
import Hero from '../components/dashboard/Hero';
import SearchSection from '../components/dashboard/SearchSection';

const DashboardPage: React.FC = () => (
  <div>
    <Navbar />
    <Hero />
    <SearchSection />
  </div>
);

export default DashboardPage;