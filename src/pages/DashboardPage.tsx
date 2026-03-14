import React from 'react';
import Navbar from '../components/dashboard/Navbar/Navbar';
import Hero from '../components/dashboard/Hero';
import SearchSection from '../components/dashboard/SearchSection';
import BookstoreSearch from '../components/dashboard/BookstoreSearch/BookstoreSearch';

const DashboardPage: React.FC = () => (
  <div>
    <Navbar />
    <Hero />
    <SearchSection />
   <BookstoreSearch/>
  </div>
);

export default DashboardPage;