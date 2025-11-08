import React from 'react';
import Navbar from '../shared/components/organisms/landing/Navbar';
import HeroSection from '../shared/components/organisms/landing/HeroSection';
import SportsCarousel from '../shared/components/organisms/landing/SportCarousel';
import DigitalizeSport from '../shared/components/organisms/landing/DigitalizeSport';
import HowItWorks from '../components/organisms/HowItWorks';
import WhyFIELdZ from '../shared/components/organisms/landing/WhyFIELdZ';
import TestezFieldz from '../shared/components/organisms/landing/TestezFieldz';
import MobileApp from '../shared/components/organisms/landing/MobileApp';
import ClubsPartnership from '../shared/components/organisms/landing/ClubsPartnership';
import Footer from '../shared/components/organisms/landing/Footer';

interface LandingPageProps {
  onNavigate: (view: 'landing' | 'player' | 'club') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => (
  <>
    <Navbar />
    <HeroSection onNavigate={onNavigate} />
    <SportsCarousel />
    <div id="comment-ca-marche">
      <DigitalizeSport />
    </div>
    <div id="pourquoi-fieldz">
      <WhyFIELdZ />
    </div>
    <TestezFieldz />
    <MobileApp />
    <div id="pour-les-clubs">
      <ClubsPartnership />
    </div>
    <Footer />
  </>
);

export default LandingPage;