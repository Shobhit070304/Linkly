import React from "react";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import UrlShortner from "../components/Home/UrlShortner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FuturisticBackground from "../components/Common/Background";

const Home = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden font-sans">
      {/* Toast Container for Notifications */}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition:Bounce
        toastClassName="!bg-gray-800/95 !backdrop-blur-sm !border !border-gray-700 !shadow-lg !rounded-xl !p-4 !text-sm"
        bodyClassName="!p-0 !m-0"
        progressClassName="!bg-gradient-to-r !from-purple-500 !to-pink-500"
        closeButton={({ closeToast }) => (
          <button
            onClick={closeToast}
            className="!text-gray-400 cursor-pointer hover:!text-white !transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      />
      {/* Futuristic 3D Background */}
      <FuturisticBackground />
      {/* Content Layer */}
      <div className="relative z-10">
        <Navbar />
        <UrlShortner />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
