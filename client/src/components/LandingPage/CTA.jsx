import React from "react";
import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="relative container mx-auto px-6 py-24">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900/50 to-indigo-900/20 rounded-3xl p-16 border border-indigo-500/20 backdrop-blur-lg">
        <h2 className="text-3xl font-light text-white mb-6">
          Ready for the future of links?
        </h2>
        <p className="text-gray-400 mb-10 max-w-2xl">
          Be part of the new wave changing how we share online.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/home"
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/home"
            className="px-8 py-4 border border-indigo-500/30 text-white rounded-lg hover:bg-indigo-500/10 transition-colors duration-300"
          >
            Request Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTA;
