import React from "react";
import { FaChartLine, FaLink, FaLock } from "react-icons/fa";

function Features() {
  return (
    <section id="features" className="relative container mx-auto px-6 py-24">
      <div className="max-w-6xl mx-auto bg-gray-900/20 backdrop-blur-lg rounded-3xl p-12 border border-gray-800/50">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-light mb-4">Designed for the future</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Cutting-edge features wrapped in an elegant interface
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-gray-900/30 hover:bg-gray-900/50 p-8 rounded-xl border border-gray-800/50 hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors duration-300">
              <FaLink className="text-indigo-400 group-hover:text-indigo-300 text-xl transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-medium mb-3">Quick Links</h3>
            <p className="text-gray-400">
              Fast and easy URL shortener with reliable uptime.
            </p>
          </div>

          <div className="group bg-gray-900/30 hover:bg-gray-900/50 p-8 rounded-xl border border-gray-800/50 hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors duration-300">
              <FaChartLine className="text-indigo-400 group-hover:text-indigo-300 text-xl transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-medium mb-3">Simple Analytics</h3>
            <p className="text-gray-400">
              Basic real-time stats to track your link usage.
            </p>
          </div>

          <div className="group bg-gray-900/30 hover:bg-gray-900/50 p-8 rounded-xl border border-gray-800/50 hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors duration-300">
              <FaLock className="text-indigo-400 group-hover:text-indigo-300 text-xl transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-medium mb-3">Secure Access</h3>
            <p className="text-gray-400">
              Easy link protection with safe data handling.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
