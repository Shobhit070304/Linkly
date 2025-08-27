import React from "react";
import FuturisticBackground from "../components/Common/Background";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import Hero from "../components/LandingPage/Hero";
import Marquee from "../components/LandingPage/Marquee";
import Features from "../components/LandingPage/Features";
import HowToUse from "../components/LandingPage/HowToUse";
import FAQs from "../components/LandingPage/FAQs";
import CTA from "../components/LandingPage/CTA";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Futuristic 3D Background */}
      <FuturisticBackground />

      <Navbar />

      <Hero />
      <Marquee />
      <Features />
      <HowToUse />
      <FAQs />
      <CTA />

      <Footer />
    </div>
  );
};

export default LandingPage;
