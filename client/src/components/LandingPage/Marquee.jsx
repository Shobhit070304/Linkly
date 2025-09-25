import React from "react";

function Marquee() {
  const features = [
    { text: "URL Shortening", icon: "🔗" },
    { text: "Real-Time Analytics", icon: "📊" },
    { text: "Custom Domains", icon: "🌐" },
    { text: "QR Code Generation", icon: "📱" },
    { text: "Password Protection", icon: "🔒" },
    { text: "Link Management", icon: "✨" },
    { text: "Click Tracking", icon: "👁️" },
    { text: "API Access", icon: "⚙️" }
  ];

  return (
    <div className="relative overflow-hidden py-5 bg-gradient-to-r from-gray-900/50 to-gray-900/30 border-y border-gray-800/50">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 z-10"></div>

      <div className="flex">
        {/* First set */}
        <div className="flex animate-marquee whitespace-nowrap py-2 flex-shrink-0">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center mx-8 md:mx-20 group">
              <span className="text-gray-400 text-sm tracking-wide group-hover:text-indigo-300 transition-colors">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Duplicate for seamless loop */}
        <div className="flex animate-marquee whitespace-nowrap py-2 flex-shrink-0">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center mx-8 md:mx-20 group">
              <span className="text-gray-400 text-sm tracking-wide group-hover:text-indigo-300 transition-colors">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Marquee;