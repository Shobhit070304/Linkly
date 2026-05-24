import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Common/Navbar";
import { ArrowRight, BarChart2, Shield, Zap } from "lucide-react";

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#000000] transition-colors relative font-sans">
      
      {/* Vercel-style subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Hero Section */}
        <main className="flex-grow flex flex-col items-center justify-center pt-20 pb-32 px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tighter leading-tight">
              The infrastructure for <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">
                your short links.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed tracking-tight">
              Linkly provides the building blocks for creating, managing, and tracking short URLs at scale. Engineered for performance and reliability.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link
                to="/home"
                className="w-full sm:w-auto px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium transition-all hover:bg-gray-800 dark:hover:bg-gray-200 shadow-[0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://github.com/Shobhit070304/Linkly"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-black text-gray-900 dark:text-white rounded-md font-medium transition-all hover:bg-gray-50 dark:hover:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center"
              >
                View Repository
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div className="max-w-5xl mx-auto w-full mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            <div className="p-6 rounded-xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm group hover:border-black/20 dark:hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Edge Routing</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Redirects are executed globally in milliseconds. Powered by Upstash Redis and BullMQ for zero-latency logging.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm group hover:border-black/20 dark:hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center mb-4">
                <BarChart2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Advanced Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Capture every interaction. Device fingerprints, geographic locations, and referrer data processed in real-time.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm group hover:border-black/20 dark:hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Enterprise Security</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Self-destructing links, mandatory expirations, and custom aliasing to protect your brand integrity.
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default LandingPage;
