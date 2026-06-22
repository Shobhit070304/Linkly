import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/UserContext";
import {
  Link as LinkIcon,
  Copy,
  BarChart2,
  Trash2,
  ArrowRight,
  QrCode,
  AlertCircle
} from "lucide-react";

function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLinks, setTotalLinks] = useState(0);
  const [globalClicks, setGlobalClicks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const { user } = useContext(AuthContext);

  const fetchUrls = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/url/me?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUrls(response.data.urls || []);
      setTotalLinks(response.data.totalLinks || 0);
      setGlobalClicks(response.data.totalClicks || 0);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (error) {
      toast.error("Failed to load URLs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleDelete = async (shortUrl) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/url/${shortUrl}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data && response.data.status) {
        toast.success("URL deleted");
        fetchUrls(currentPage);
      } else {
        toast.error("Failed to delete URL");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Partition links into Active and Expired
  const now = new Date();
  const isExpired = (url) => {
    const expiredByDate = url.expiresAt && new Date(url.expiresAt) < now;
    const expiredByClicks = url.maxClicks && url.clicks >= url.maxClicks;
    return expiredByDate || expiredByClicks;
  };

  const activeUrls = urls.filter(url => !isExpired(url));
  const expiredUrls = urls.filter(url => isExpired(url));

  const renderUrlTable = (urlList, isExpiredSection = false) => {
    if (urlList.length === 0) {
      return (
        <div className="p-12 text-center text-gray-500 dark:text-gray-400">
          <LinkIcon className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No links in this category.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Link Details</th>
              <th className="px-6 py-4 font-medium hidden sm:table-cell">Target URL</th>
              <th className="px-6 py-4 font-medium">Clicks</th>
              {isExpiredSection && <th className="px-6 py-4 font-medium">Status</th>}
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {urlList.map((url) => {
              const shortLink = `${import.meta.env.VITE_BACKEND_URL}/${url.shortUrl}`;
              return (
                <tr key={url.id || url.shortUrl} className={`hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group ${isExpiredSection ? 'opacity-70' : ''}`}>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {url.favicon ? (
                        <img src={url.favicon} alt="" className={`w-6 h-6 rounded-sm bg-white ${isExpiredSection && 'grayscale'}`} />
                      ) : (
                        <div className="w-6 h-6 rounded-sm bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                          <LinkIcon className="w-3 h-3 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          <span className={isExpiredSection ? "line-through text-gray-500" : ""}>
                            {url.customShort || url.shortUrl}
                          </span>
                          {!isExpiredSection && (
                            <button onClick={() => copyToClipboard(shortLink)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-black dark:hover:text-white transition-all">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <a href={isExpiredSection ? "#" : shortLink} target={isExpiredSection ? "_self" : "_blank"} rel="noreferrer" className="text-xs text-blue-500 hover:underline">
                          {import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL.replace(/^https?:\/\//, '') + '/' : 'linkly.com/'}{url.customShort || url.shortUrl}
                        </a>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 hidden sm:table-cell max-w-xs">
                    <a href={url.longUrl} target="_blank" rel="noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white truncate block transition-colors">
                      {url.longUrl}
                    </a>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-medium text-gray-900 dark:text-white">
                      {url.clicks} {url.maxClicks ? `/ ${url.maxClicks}` : ''} <BarChart2 className="w-3 h-3 text-gray-500" />
                    </span>
                  </td>

                  {isExpiredSection && (
                     <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-[10px] font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50">
                           <AlertCircle className="w-3 h-3" />
                           {url.maxClicks && url.clicks >= url.maxClicks ? 'Limit Reached' : 'Expired'}
                        </span>
                     </td>
                  )}

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {!isExpiredSection && (
                        <button onClick={() => {
                          const a = document.createElement("a");
                          a.href = url.qrCode;
                          a.download = `${url.shortUrl}-qr.png`;
                          a.click();
                        }} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="Download QR">
                          <QrCode className="w-4 h-4" />
                        </button>
                      )}
                      
                      <Link to={`/analytics/${url.shortUrl}`} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="Analytics">
                        <BarChart2 className="w-4 h-4" />
                      </Link>

                      <button onClick={() => handleDelete(url.shortUrl)} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your links and view performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-md">
                <LinkIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
             </div>
             <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Total Links</span>
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">{totalLinks}</h2>
        </div>
        
        <div className="glass-card p-6 rounded-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-md">
                <BarChart2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
             </div>
             <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Total Clicks</span>
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">{globalClicks}</h2>
        </div>
      </div>

      {/* Active Links Table */}
      <div className="glass-card rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">Active Links</h3>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-medium text-gray-600 dark:text-gray-300">
              {activeUrls.length}
            </span>
          </div>
          <Link to="/home" className="text-xs font-medium px-3 py-1.5 rounded-md bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black transition-colors flex items-center gap-1.5">
             Create Link <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {renderUrlTable(activeUrls, false)}
      </div>

      {/* Expired Links Table */}
      {expiredUrls.length > 0 && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">Expired & Limit Reached</h3>
              <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-xs font-medium text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                {expiredUrls.length}
              </span>
            </div>
          </div>
          {renderUrlTable(expiredUrls, true)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 p-4 glass-card rounded-xl">
          <button
            disabled={currentPage === 1}
            onClick={() => fetchUrls(currentPage - 1)}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors text-gray-700 dark:text-gray-200"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => fetchUrls(currentPage + 1)}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors text-gray-700 dark:text-gray-200"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
