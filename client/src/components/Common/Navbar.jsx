import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";
import { Link as LinkIcon, Sun, Moon, Menu, X } from "lucide-react";

function Navbar() {
  const { user, loading } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  if (loading) {
    return (
      <div className="h-16 flex items-center justify-center text-gray-800 dark:text-gray-200">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-butterscotch-500"></div>
      </div>
    );
  }

  const randomSeed = user?.name + Math.floor(Math.random() * 10000);
  const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-2xl font-bold tracking-tight"
        >
          <div className="bg-butterscotch-500 p-1.5 rounded-lg">
            <LinkIcon className="text-white h-5 w-5" />
          </div>
          <span className="text-gray-900 dark:text-white">
            Linkly
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link to="/" className="text-gray-600 hover:text-butterscotch-500 dark:text-gray-300 dark:hover:text-butterscotch-400 transition">
            Home
          </Link>
          <Link to="/home" className="text-gray-600 hover:text-butterscotch-500 dark:text-gray-300 dark:hover:text-butterscotch-400 transition">
            Shorten URL
          </Link>
          {user && (
            <Link to="/dashboard" className="text-gray-600 hover:text-butterscotch-500 dark:text-gray-300 dark:hover:text-butterscotch-400 transition">
              Dashboard
            </Link>
          )}
        </div>

        {/* Actions (Theme + Auth) */}
        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 text-gray-500 hover:text-butterscotch-500 dark:text-gray-400 dark:hover:text-butterscotch-400 bg-gray-100 dark:bg-gray-800 rounded-full transition"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user ? (
            <Link to="/auth" className="flex items-center">
              <img
                src={avatar}
                alt="User"
                className="w-10 h-10 rounded-full ring-2 ring-butterscotch-500/50 object-cover"
              />
            </Link>
          ) : (
            <Link
              to="/auth"
              className="text-sm px-5 py-2.5 font-medium bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full hover:bg-butterscotch-500 dark:hover:bg-butterscotch-500 dark:hover:text-white transition-all shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-4">
           <button 
            onClick={toggleTheme} 
            className="p-2 text-gray-500 dark:text-gray-400"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button
            className="text-gray-900 dark:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex flex-col space-y-4 shadow-xl z-40 transition-colors">
          <Link onClick={() => setMenuOpen(false)} to="/" className="text-gray-600 hover:text-butterscotch-500 dark:text-gray-300 font-medium">
            Home
          </Link>
          <Link onClick={() => setMenuOpen(false)} to="/home" className="text-gray-600 hover:text-butterscotch-500 dark:text-gray-300 font-medium">
            Shorten URL
          </Link>
          {user && (
            <Link onClick={() => setMenuOpen(false)} to="/dashboard" className="text-gray-600 hover:text-butterscotch-500 dark:text-gray-300 font-medium">
              Dashboard
            </Link>
          )}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            {user ? (
              <Link onClick={() => setMenuOpen(false)} to="/auth" className="flex items-center space-x-3">
                <img src={avatar} alt="User" className="w-10 h-10 rounded-full ring-2 ring-butterscotch-500" />
                <span className="font-medium text-gray-900 dark:text-white">Profile & Settings</span>
              </Link>
            ) : (
              <Link
                onClick={() => setMenuOpen(false)}
                to="/auth"
                className="block text-center w-full py-3 font-medium bg-butterscotch-500 text-white rounded-xl shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
