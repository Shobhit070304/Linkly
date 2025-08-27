import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative container mx-auto px-6 pt-24 pb-32 md:pt-30 md:pb-48">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-60 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10 text-center md:text-left">
        {/* Heading */}
        <div className="inline-flex items-center rounded-full bg-indigo-500/10 px-4 py-2 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20 mb-8">
          MODERN LINK MANAGEMENT
        </div>
        
        <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight mb-8">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Smart & Secure
          </span>{" "}
          <br className="hidden md:block" />Link Management
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto md:mx-0">
          Instantly shorten links with powerful analytics and privacy-first
          features – all in one clean dashboard.
        </p>

        {/* Input + CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Input Field */}
          <div className="relative flex-grow max-w-2xl mx-auto sm:mx-0">
            <input
              type="text"
              placeholder="Paste your long URL here"
              className="w-full px-6 py-5 bg-gray-900/40 backdrop-blur-lg border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition-all duration-300"
            />
            <Link
              to="/home"
              className="absolute right-2 top-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center group"
            >
              Shorten <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <Link
            to="/dashboard"
            className="px-6 py-5 text-sm bg-gray-900/40 backdrop-blur-lg border border-gray-800 rounded-xl hover:bg-gray-800/40 transition-all duration-300 text-white text-center hover:shadow-lg hover:shadow-indigo-500/10 flex items-center justify-center"
          >
            Visit Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
