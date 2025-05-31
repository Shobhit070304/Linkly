import React from "react";
import { FaLink } from "react-icons/fa";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

function Footer() {
  return (
    <footer className="border-t border-gray-800/50 py-16 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-12">
          <div>
            <div className="flex justify-center items-center space-x-3 mb-6">
              <FaLink className="text-indigo-400 text-xl" />
              <span className="text-xl font-light tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                LINKLY
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              The futuristic URL shortener for visionary brands.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-10 justify-between">
            <h4 className="text-gray-300 text-xs font-medium mb-4 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Shobhit070304"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <FiGithub className="text-lg" />
              </a>
              <a
                href="https://www.linkedin.com/in/shobhit-kumar-sharma-17bb4223a"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <FiLinkedin className="text-lg" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Linkly Technologies. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href=""
              className="text-gray-500 hover:text-white text-sm transition-colors duration-300"
            >
              Privacy
            </a>
            <a
              href=""
              className="text-gray-500 hover:text-white text-sm transition-colors duration-300"
            >
              Terms
            </a>
            <a
              href=""
              className="text-gray-500 hover:text-white text-sm transition-colors duration-300"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
