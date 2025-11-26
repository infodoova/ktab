import Navbar from "./components/myui/HomePage/navbar";
import HeroSection from "./components/myui/HomePage/hero";
import ForAllAges from './components/myui/HomePage/ForAllAges'
import OwlFeatureDirections from './components/myui/HomePage/whatAbout'
import PricingSection from './components/myui/HomePage/pricing'
import RolesSection from './components/myui/HomePage/roles'
import Footer from './components/myui/HomePage/footer'
import FAQ from './components/myui/HomePage/FAQ'
import TrustedSection from './components/myui/HomePage/TrustedSection'
const HomePage = () => {
  return (
    <>
  <Navbar/>
  <HeroSection/>
  <ForAllAges/>
  <RolesSection/>
  <OwlFeatureDirections/>
  <TrustedSection/>
  <PricingSection/>
  <FAQ/>
  <Footer/>

    </>
  );
};

export default HomePage;
