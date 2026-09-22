import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/Hero";
import ShowcaseVideo from "../components/ShowcaseVideo";
import RolesSection from "../components/Roles";
import InteractiveStories from "../components/InteractiveStories";
import BooksMasonry from "../components/BooksMasonry";
import PricingSection from "../components/Pricing";
import ReadAnywhere from "../components/ReadAnywhere";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import { VoiceSampleModalContainer } from "../components/VoiceSampleModal/VoiceSampleModalContainer";

// Standalone View Styles
import "./HomeView.css";

/**
 * Pure presentation landing view for the Ktab platform.
 * Fully rebranded in Eleven Reader Light Mode.
 */
export function HomeView() {
  return (
    <div className="homepage-light">
      {/* Rebranded Eleven Reader Light Mode Components */}
      <Navbar />
      <HeroSection />
      <ShowcaseVideo />
      <RolesSection />
      <BooksMasonry />
      <InteractiveStories />
      <ReadAnywhere />
      <PricingSection />
      <FAQ />
      <Footer />

      {/* Single Unified Voice Sample Modal across the entire landing page */}
      <VoiceSampleModalContainer />
    </div>
  );
}

export default HomeView;
