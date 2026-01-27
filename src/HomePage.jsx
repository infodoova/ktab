import React from "react";
import HeroSection from "./components/myui/HomePage/hero";
import ForAllAges from "./components/myui/HomePage/ForAllAges";
import OwlFeatureDirections from "./components/myui/HomePage/whatAbout";
import PricingSection from "./components/myui/HomePage/pricing";
import RolesSection from "./components/myui/HomePage/roles";
import Footer from "./components/myui/HomePage/footer";
import FAQ from "./components/myui/HomePage/FAQ";
import Navbar from "./components/myui/HomePage/navbar";
import BooksMasonry from "./components/myui/HomePage/BooksMasonry";

// Import HomePage-specific dark theme styles
import "./components/myui/HomePage/HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage-dark bg-[var(--bg-dark)] custom-scrollbar">
      <Navbar />
      <HeroSection />
      <ForAllAges />
      <RolesSection />
      <OwlFeatureDirections />
      <BooksMasonry />
      <PricingSection />
      <FAQ />
      <Footer />
    </div>
  );
};

export default HomePage;
