import Navbar from '../components/organisms/navbar';
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
    <HowItWorks />
    <WhyFIELdZ />
    <PWAInstall />
    <ClubsPartnership />
    <Footer />
  </>
)
export default LandingPage
