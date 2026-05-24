import { Github, Linkedin, LinkIcon } from "lucide-react";
import React from "react";

function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors py-10 text-sm text-gray-500 dark:text-gray-400 px-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo and tagline */}
        <div className="flex items-center gap-3">
          <div className="bg-butterscotch-500 p-1.5 rounded-lg">
            <LinkIcon className="text-white h-4 w-4" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white tracking-tight">
            Linkly
          </span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Shobhit070304"
            className="hover:text-butterscotch-500 transition-colors"
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/shobhit-kumar-sharma-17bb4223a"
            className="hover:text-butterscotch-500 transition-colors"
            aria-label="LinkedIn"
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>

        {/* Bottom Links */}
        <div className="flex items-center gap-6 text-xs font-medium">
          <a href="#" className="hover:text-butterscotch-500 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-butterscotch-500 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-butterscotch-500 transition-colors">
            Cookies
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
        © {new Date().getFullYear()} Linkly Technologies. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
