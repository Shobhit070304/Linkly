import {
  ChartBarIcon,
  CopyIcon,
  LinkIcon,
  PencilIcon,
  QrCodeIcon,
  TrashIcon,
} from "lucide-react";
import Background from "../components/Common/Background";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "../components/Common/Navbar";

function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchUrls = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing. Please login again.");
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/url/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.urls) {
        setUrls(response.data.urls || []);
        setQrCode(response.data.qrCode || '');
      } else {
        setUrls([]);
      }
    } catch (error) {
      console.error("Error fetching URLs:", error);
      toast.error("Failed to load your URLs. Please try again later.");
      setUrls([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUrls();
  }, []);

  const handleDelete = async (shortUrl) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing. Please login again.");
        return;
      }
      
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/url/delete`,
        {
          shortUrl: shortUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.status) {
        toast.success("URL deleted successfully");
        fetchUrls();
      } else {
        toast.error("Failed to delete URL");
      }
    } catch (error) {
      console.error("Error deleting URL:", error);
      toast.error("Failed to delete URL. Please try again later.");
    }
  };

  return (
    <>
      <Background />
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Your Shortened URLs
          </h1>
          <Link
            to="/home"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm"
          >
            + Create New
          </Link>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white/10 border-b border-white/10 text-gray-300 font-medium text-sm">
            <div className="col-span-2">Name</div>
            <div className="col-span-4">Original URL</div>
            <div className="col-span-3">Short URL</div>
            <div className="col-span-1 text-center">Clicks</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div>
            {urls.map((url) => (
              <div
                key={url._id}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-700/40 hover:bg-gray-700/20 transition-all"
              >
                {/* Name / Alias */}
                <div className="col-span-2 text-white font-medium truncate flex items-center gap-2">
                  {url.customShort || "Untitled"}
                  {url.maxClicks === 1 && (
                    <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">
                      One-Time
                    </span>
                  )}
                </div>

                {/* Original URL */}
                {/* <div className="col-span-4 text-gray-400 truncate flex items-center gap-2">
                  <CopyIcon
                    onClick={() => navigator.clipboard.writeText(url.longUrl)}
                    className="h-4 w-4 hover:text-indigo-400 cursor-pointer"
                  />
                  <a
                    href={url.longUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-400 text-sm hover:underline"
                  >
                    {url.longUrl}
                  </a>
                </div> */}

                {/* Original URL with preview */}
                <div className="col-span-4 flex items-center gap-3">
                  {url.favicon && (
                    <img
                      src={url.favicon}
                      alt="favicon"
                      className="w-5 h-5 rounded-sm"
                    />
                  )}
                  <div className="truncate">
                    <a
                      href={url.longUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-indigo-400 text-sm font-medium hover:underline truncate block"
                    >
                      {url.title || url.longUrl}
                    </a>
                    {url.description && (
                      <p className="text-gray-400 text-xs truncate">
                        {url.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Short URL */}
                <div className="col-span-3 text-gray-400 truncate flex items-center gap-2">
                  <CopyIcon
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${import.meta.env.VITE_BACKEND_URL}/${url.shortUrl}`
                      )
                    }
                    className="h-4 w-4 hover:text-indigo-400 cursor-pointer"
                  />
                  <a
                    href={`${import.meta.env.VITE_BACKEND_URL}/${url.shortUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-400 text-sm hover:underline"
                  >
                    {import.meta.env.VITE_BACKEND_URL + "/" + url.shortUrl}
                  </a>
                </div>

                {/* Clicks */}
                <div className="col-span-1 text-center text-white flex items-center justify-center gap-1">
                  <ChartBarIcon className="h-4 w-4 text-indigo-400" />
                  <span>{url.clicks}</span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-3">
                  {/* QR Download */}
                  <button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = url.qrCode;
                      a.download = `${url.customShort || url.shortUrl}-qr.png`;
                      a.click();
                    }}
                    className="text-gray-400 cursor-pointer hover:text-blue-400 transition-colors"
                    title="Download QR"
                  >
                    <QrCodeIcon className="h-5 w-5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(url.shortUrl)}
                    className="text-gray-400 cursor-pointer hover:text-red-400 transition-colors"
                    title="Delete URL"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {urls.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <p className="mb-2">You haven't created any short URLs yet.</p>
              <Link
                to="/home"
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Create your first short URL →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
