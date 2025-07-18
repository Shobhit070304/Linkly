import React from "react";
import { FaChartLine, FaLink, FaLock } from "react-icons/fa";

function Features() {
  return (
    <section id="features" className="relative container mx-auto px-6 py-24">
      <div className="max-w-6xl mx-auto bg-gray-900/20 backdrop-blur-lg rounded-3xl p-12 border border-gray-800/50">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Built for Simplicity
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Everything you need to shorten, share, and manage your links — all
            in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group bg-gray-900/30 hover:bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20">
              <FaLink className="text-indigo-400 group-hover:text-indigo-300 text-xl transition-colors duration-300" />
            </div>
            <h3 className="text-lg text-white mb-3 font-normal">
              Instant Shortening
            </h3>
            <p className="text-gray-400 text-sm">
              Shorten links in a click — quick, reliable, and always online.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-gray-900/30 hover:bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20">
              <FaChartLine className="text-indigo-400 group-hover:text-indigo-300 text-xl transition-colors duration-300" />
            </div>
            <h3 className="text-lg text-white mb-3 font-normal">
              Real-Time Analytics
            </h3>
            <p className="text-gray-400 text-sm">
              Track clicks and performance with simple stats.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-gray-900/30 hover:bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20">
              <FaLock className="text-indigo-400 group-hover:text-indigo-300 text-xl transition-colors duration-300" />
            </div>
            <h3 className="text-lg text-white mb-3 font-normal">
              Secure Access
            </h3>
            <p className="text-gray-400 text-sm">
              Password protection and safe handling for your links.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
