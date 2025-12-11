import React, { useState, useEffect } from "react";
import HeroSection from "./components/myui/HomePage/hero";
import ForAllAges from "./components/myui/HomePage/ForAllAges";
import OwlFeatureDirections from "./components/myui/HomePage/whatAbout";
import PricingSection from "./components/myui/HomePage/pricing";
import RolesSection from "./components/myui/HomePage/roles";
import Footer from "./components/myui/HomePage/footer";
import FAQ from "./components/myui/HomePage/FAQ";
import CinematicIntro from "./components/myui/HomePage/CinematicIntro";
import Navbar from "./components/myui/HomePage/navbar";
import BooksMasonry from './components/myui/HomePage/BooksMasonry'
const HomePage = () => {
  const [playIntro, setPlayIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPlayIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (playIntro) {
    return <CinematicIntro />;
  }

  return (
    <>
      <Navbar />
      <HeroSection />
      <ForAllAges />
      <RolesSection />
      <OwlFeatureDirections />
      <BooksMasonry/>
      <PricingSection />
      <FAQ />
      <Footer />
    </>
  );
};

export default HomePage;
