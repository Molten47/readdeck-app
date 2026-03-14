import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar/LandingNavbar';
import LandingHero from '../components/landing/LandingHero/LandingHero';
import FeaturesSection from '../components/landing/FeaturesSection/FeaturesSection';
import { PromoBlockOne, PromoBlockTwo } from '../components/landing/PromoSection/PromoSection';
import BestSellers from '../components/landing/BestSellers/BestSellers';
import Testimonials from '../components/landing/Testimonials/Testimonials';
import Footer from '../components/landing/Footer/Footer';

const LandingPage: React.FC = () => {
  return (
    <>
      <LandingNavbar />
      <LandingHero />
      <FeaturesSection />
      <PromoBlockOne />
      <BestSellers />
      <PromoBlockTwo />
      <Testimonials />
      <Footer />
    </>
  );
};

export default LandingPage;