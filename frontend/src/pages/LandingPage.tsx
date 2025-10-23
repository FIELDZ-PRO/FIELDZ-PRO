import React from 'react';
import Navbar from '../components/organisms/Navbar';
import HeroSection from '../components/organisms/HeroSection';
import SportsCarousel from '../components/organisms/SportCarousel';
import DigitalizeSport from '../components/organisms/DigitalizeSport';
import HowItWorks from '../components/organisms/HowItWorks';
import WhyFIELdZ from '../components/organisms/WhyFIELdZ';
import ClubsPartnership from '../components/organisms/ClubsPartnership';
import Footer from '../components/organisms/Footer';

interface LandingPageProps {
  onNavigate: (view: 'landing' | 'player' | 'club') => void;
}
const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => (
  <>
    <Navbar />
    <HeroSection onNavigate={onNavigate} />
    <SportsCarousel />
    <DigitalizeSport />
    <div id="comment-ca-marche">
      <HowItWorks />
    </div>
    <div id="pourquoi-fieldz">
      <WhyFIELdZ />
    </div>
    <div id="pour-les-clubs">
      <ClubsPartnership />
    </div>
    <Footer />
  </>
);

export default LandingPage;