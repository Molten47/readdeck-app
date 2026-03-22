import React from 'react';
import FeaturesSection from '../components/landing/FeaturesSection/FeaturesSection';
import { PromoBlockOne, PromoBlockTwo } from '../components/landing/PromoSection/PromoSection';
import BestSellers from '../components/landing/BestSellers/BestSellers';
import Testimonials from '../components/landing/Testimonials/Testimonials';
import Footer from '../components/landing/Footer/Footer';
import './landingmobile.css'

const LandingShell: React.FC = () => (
  <>
    <FeaturesSection />
    <PromoBlockOne />
    <BestSellers />
    <PromoBlockTwo />
    <Testimonials />
    <Footer />
  </>
);

export default LandingShell;