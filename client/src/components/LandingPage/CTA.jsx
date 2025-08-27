import React from "react";
import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="relative container mx-auto px-6 py-24">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900/70 to-indigo-900/30 rounded-3xl p-16 border border-indigo-500/30 backdrop-blur-xl shadow-2xl shadow-indigo-500/10">
        <h2 className="text-3xl md:text-4xl font-light text-white mb-6 text-center">
          Ready for the{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            future of links
          </span>
          ?
        </h2>
        <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-center">
          Be part of the new wave changing how we share online.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/home"
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            Get Started
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 group-hover:translate-x-1 transition-transform"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <Link
            to="/home"
            className="px-8 py-4 border border-indigo-500/40 text-white rounded-xl hover:bg-indigo-500/10 hover:border-indigo-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
          >
            Request Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTA;
