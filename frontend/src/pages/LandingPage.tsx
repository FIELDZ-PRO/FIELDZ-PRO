import React from 'react';
import Navbar from '../components/organisms/Navbar';
import HeroSection from '../components/organisms/HeroSection'
import HowItWorks from '../components/organisms/HowItWorks'
import WhyFIELdZ from '../components/organisms/WhyFIELdZ'
import PWAInstall from '../components/organisms/PWAInstall'
import ClubsPartnership from '../components/organisms/ClubsPartnership'
import Footer from '../components/organisms/Footer'

const LandingPage = ({ onNavigate }) => (
  <>
    <Navbar />
    <HeroSection onNavigate={onNavigate} />
    <div id="comment-ca-marche">
      <HowItWorks />
    </div>
    <div id="pourquoi-fieldz">
      <WhyFIELdZ />
    </div>
    <PWAInstall />
    <div id="pour-les-clubs">
      <ClubsPartnership />
    </div>
    <Footer />
  </>
)
export default LandingPage