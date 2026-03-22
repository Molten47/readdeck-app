import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar/LandingNavbar';
import LandingHero from '../components/landing/LandingHero/LandingHero';
import LandingShell from './LandingShell';

const LandingPage: React.FC = () => (
  <>
    <LandingNavbar />
    <LandingHero />
    <LandingShell />
  </>
);

export default LandingPage;