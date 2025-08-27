import React from "react";
import FuturisticBackground from "../components/Common/Background";
import Footer from "../components/Common/Footer";
import Navbar from "../components/Common/Navbar";
import Hero from "../components/LandingPage/Hero";
import Features from "../components/LandingPage/Features";
import CTA from "../components/LandingPage/CTA";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Futuristic 3D Background */}
      <FuturisticBackground />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* CTA Section */}
      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
