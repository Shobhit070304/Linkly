import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/UserContext";
import { FaLink } from "react-icons/fa";

function Navbar() {
  const { user, loading } = useContext(AuthContext);

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
    <nav className="container mx-auto px-[5%] py-8 flex justify-between items-center z-10">
      <div className="flex items-center space-x-3">
        <FaLink className="text-indigo-400 text-2xl" />
        <Link
          to="/"
          className="text-2xl font-light tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500"
        >
          LINKLY
        </Link>
      </div>
      <div className="hidden md:flex items-center space-x-10">
        {path === "" && (
          <>
            <Link
              to="/home"
              className="text-gray-400 hover:text-white transition-colors duration-300 text-sm uppercase tracking-wider hover:bg-gray-700/50 px-4 py-2 rounded-lg"
            >
              Home
            </Link>
            <a
              href="#features"
              className="text-gray-400 hover:text-white transition-colors duration-300 text-sm uppercase tracking-wider hover:bg-gray-900/50 px-4 py-2 rounded-lg"
            >
              Features
            </a>
          </>
        )}
        {path !== "dashboard" && <Link
          to={user ? "/dashboard" : "/auth"}
          className="text-gray-400 hover:text-white transition-colors duration-300 text-sm uppercase tracking-wider hover:bg-gray-900/50 px-4 py-2 rounded-lg"
        >
          Dashboard
        </Link>}
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <Link to="/auth">
            <img
              src={avatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-indigo-500"
            />
          </Link>
        ) : (
          <Link
            to="/auth"
            className="px-5 py-2 text-sm text-white font-medium border border-gray-800 rounded-lg hover:bg-gray-900/50 transition-colors duration-300 backdrop-blur-sm"
          >
            Sign In
          </Link>
        )}
        {path === "" && (
          <Link
            to="/home"
            className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-300 backdrop-blur-sm"
          >
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
