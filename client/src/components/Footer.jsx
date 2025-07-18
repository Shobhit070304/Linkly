import React from "react";
import { FaLink } from "react-icons/fa";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

function Footer() {
  return (
    <footer className="border-t border-gray-800/50 py-10 text-sm text-gray-400 px-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo and tagline */}
        <div className="flex items-center gap-3">
          <FaLink className="text-indigo-400 text-lg" />
          <span className="font-light text-base bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            LINKLY
          </span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Shobhit070304"
            className="hover:text-white transition"
            aria-label="GitHub"
          >
            <FiGithub className="text-lg" />
          </a>
          <a
            href="https://www.linkedin.com/in/shobhit-kumar-sharma-17bb4223a"
            className="hover:text-white transition"
            aria-label="LinkedIn"
          >
            <FiLinkedin className="text-lg" />
          </a>
        </div>

        {/* Bottom Links */}
        <div className="flex items-center gap-4 text-xs">
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
          <a href="#" className="hover:text-white transition">
            Cookies
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Linkly Technologies. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
