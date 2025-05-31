import React from "react";
import FuturisticBackground from "../components/Background";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import CTA from "../components/CTA";

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
