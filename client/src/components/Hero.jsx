import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative container mx-auto px-6 pt-24 pb-64 md:pt-36 md:pb-80">
      <div className="max-w-5xl mx-auto relative z-10 text-center md:text-left">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight mb-8">
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Smart &
          </span>{" "}
          Secure Link Management
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto md:mx-0">
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
              className="w-full px-6 py-5 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            />
            <Link
              to="/home"
              className="absolute right-2 top-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-md hover:opacity-90 transition duration-300 flex items-center"
            >
              Shorten <FaArrowRight className="ml-2" />
            </Link>
          </div>

          {/* Optional Button — Remove if not needed */}
          <Link
            to="/dashboard"
            className="px-6 py-5 text-sm bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-lg hover:bg-gray-800/50 transition-colors duration-300 text-white text-center"
          >
            Visit Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
