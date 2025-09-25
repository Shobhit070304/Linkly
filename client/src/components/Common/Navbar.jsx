import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/UserContext";
import { Link as LinkIcon } from "lucide-react";

function Navbar() {
  const { user, loading } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const path = location.pathname.split("/")[1];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Loading...
      </div>
    );
  }

  const randomSeed = user?.name + Math.floor(Math.random() * 10000);
  const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`;

  return (
    <nav className="relative text-white z-20">
      <div className="container mx-auto px-[5%] py-5 flex justify-between items-center">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-2xl font-light"
        >
          <LinkIcon className="text-indigo-400" />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Linkly
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm">
          <Link to="/" className="hover:text-indigo-400 transition">
            Home
          </Link>
          <Link to="/home" className="hover:text-indigo-400 transition">
            Shorten URL
          </Link>
          {user && (
            <Link to="/dashboard" className="hover:text-indigo-400 transition">
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth / Avatar */}
        <div className="hidden md:flex items-center">
          {user ? (
            <Link to="/auth">
              <img
                src={avatar}
                alt="User"
                className="w-9 h-9 rounded-full border-2 border-indigo-500 object-cover"
              />
            </Link>
          ) : (
            <Link
              to="/auth"
              className="text-sm px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#0f172a] bg-opacity-95 backdrop-blur-md md:hidden px-6 pb-4 space-y-3 shadow-lg z-30">
          <Link to="/" className="block py-2 hover:text-indigo-400">
            Home
          </Link>
          <Link to="/shorten" className="block py-2 hover:text-indigo-400">
            Shorten URL
          </Link>
          {user && (
            <Link to="/dashboard" className="block py-2 hover:text-indigo-400">
              Dashboard
            </Link>
          )}
          {user ? (
            <Link to="/auth" className="flex items-center space-x-2 py-2">
              <img
                src={avatar}
                alt="User"
                className="w-8 h-8 rounded-full border-2 border-indigo-500"
              />
              <span>Profile</span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="block px-4 py-2 text-sm border border-gray-600 rounded-lg hover:bg-gray-800"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
