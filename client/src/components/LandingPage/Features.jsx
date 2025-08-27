import React, { useState } from "react";
import {
  FaCheck,
  FaArrowRight,
  FaQuestionCircle,
  FaCopy,
  FaChartLine,
  FaLink,
  FaLock,
  FaQrcode,
  FaClock,
  FaUser,
  FaDesktop,
  FaShareAlt,
  FaEye,
  FaDownload,
  FaTrash,
  FaChevronDown,
  FaChevronRight,
  FaSignInAlt,
  FaMagic,
  FaChartBar,
} from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaLink className="text-lg" />,
      title: "URL Shortening",
      description: "Create short URLs with custom aliases"
    },
    {
      icon: <FaChartLine className="text-lg" />,
      title: "Click Analytics",
      description: "Track real-time clicks and engagement"
    },
    {
      icon: <FaQrcode className="text-lg" />,
      title: "QR Codes",
      description: "Generate and download QR codes"
    },
    {
      icon: <FaLock className="text-lg" />,
      title: "Secure Links",
      description: "Password protection and encryption"
    },
    {
      icon: <FaMagic className="text-lg" />,
      title: "Custom Branding",
      description: "Custom domains and branded links"
    },
    {
      icon: <FaDesktop className="text-lg" />,
      title: "Dashboard",
      description: "Manage all URLs in one place"
    }
  ];

  return (
    <section id="features" className="relative py-20 bg-gradient-to-b">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20 mb-6">
            CORE FEATURES
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Everything you need for <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">link management</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Advanced tools to shorten, manage, and analyze your links with precision and style.
          </p>
        </div>

        {/* Features Grid - 3x2 layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-gradient-to-b from-gray-900/40 to-gray-900/10 p-8 rounded-2xl border border-gray-800/50 hover:border-indigo-500/40 transition-all duration-300 overflow-hidden"
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="text-indigo-400 group-hover:text-indigo-300">
                  {feature.icon}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-medium text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-md leading-relaxed">
                {feature.description}
              </p>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-bl from-indigo-500/30 to-transparent rounded-bl-2xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
