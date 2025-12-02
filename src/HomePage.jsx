import React, { useState, useEffect, useRef } from 'react';
import Navbar from "./components/myui/HomePage/navbar";
import HeroSection from "./components/myui/HomePage/hero";
import ForAllAges from './components/myui/HomePage/ForAllAges';
import OwlFeatureDirections from './components/myui/HomePage/whatAbout';
import PricingSection from './components/myui/HomePage/pricing';
import RolesSection from './components/myui/HomePage/roles';
import Footer from './components/myui/HomePage/footer';
import FAQ from './components/myui/HomePage/FAQ';
import TrustedSection from './components/myui/HomePage/TrustedSection';

const HomePage = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    // 1. Capture the current ref value in a variable
    const currentHeroRef = heroRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowNavbar(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    // 2. Use the variable to observe
    if (currentHeroRef) {
      observer.observe(currentHeroRef);
    }

    // 3. Use the variable for cleanup
    return () => {
      if (currentHeroRef) {
        observer.unobserve(currentHeroRef);
      }
    };
  }, []); 

  return (
    <>
      {showNavbar && <Navbar />}
      
      <div ref={heroRef}>
        <HeroSection />
      </div>

      <ForAllAges />
      <RolesSection />
      <OwlFeatureDirections />
      <TrustedSection />
      <PricingSection />
      <FAQ />
      <Footer />
    </>
  );
};

export default HomePage;