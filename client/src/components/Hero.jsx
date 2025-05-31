import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative container mx-auto px-6 pt-24 pb-64 md:pt-36 md:pb-80">
      <div className="max-w-5xl mx-auto relative z-10">
        <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
            Next-gen
          </span>{" "}
          link management
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-3xl">
          A smart URL shortener with easy-to-understand analytics and reliable
          security for everyday use.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow max-w-2xl">
            <input
              type="text"
              placeholder="Enter your long URL"
              className="w-full px-6 py-5 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-600 transition-all duration-300"
            />
            <Link
              to="/home"
              className="absolute right-2 top-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-md hover:opacity-90 transition-opacity duration-300 flex items-center"
            >
              Shorten <FaArrowRight className="ml-2" />
            </Link>
          </div>
          <a
            href="#features"
            className="px-6 py-5 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg hover:bg-gray-800/50 transition-colors duration-300"
          >
            Explore Features
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
