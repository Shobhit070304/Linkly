import React, { useContext } from "react";
import axios from "axios";
import { useState } from "react";
import { AuthContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import {
  Link as LinkIcon,
  Expand as ExpandIcon,
  Copy as CopyIcon,
  AlertCircle as AlertCircleIcon,
  Loader2 as Loader2Icon,
  Settings2
} from "lucide-react";

function UrlShortner() {
  const [shortUrl, setShortUrl] = useState("");
  const [longUrl, setLongUrl] = useState("");
  const [generatedShortUrl, setGeneratedShortUrl] = useState("");
  const [retrivedLongUrl, setRetrivedLongUrl] = useState("");
  const [loadingShortUrl, setLoadingShortUrl] = useState(false);
  const [loadingLongUrl, setLoadingLongUrl] = useState(false);
  
  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customShort, setCustomShort] = useState("");
  const [maxClicks, setMaxClicks] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [oneTime, setOneTime] = useState(false);

  const { user } = useContext(AuthContext);

  const handleShortenUrl = async () => {
    if (!user) {
      toast.error("Please login to use the URL shortener");
      return;
    }
    if (!longUrl) {
      toast.error("Please enter a valid URL to shorten");
      return;
    }

    setGeneratedShortUrl("");
    setLoadingShortUrl(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/url/shorten`,
        {
          longUrl: longUrl,
          customShort: customShort || undefined,
          maxClicks: maxClicks ? Number(maxClicks) : undefined,
          expiresAt: expiresAt || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.status) {
        toast.success("Short URL generated successfully");
        setGeneratedShortUrl(response.data.shortUrl);
        setQrCode(response.data.qrCode);
      } else {
        toast.error(response.data.message || "Failed to shorten URL");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoadingShortUrl(false);
    }
  };

  const handleOriginalUrl = async () => {
    if (!user) {
      toast.error("Please login to retrieve the original URL");
      return;
    }
    if (!shortUrl) {
      toast.error("Please enter a short URL to expand");
      return;
    }

    setRetrivedLongUrl("");
    setLoadingLongUrl(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/url/original`,
        { shortUrl: shortUrl.split('/').pop() }, // safely extract code if full URL given
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.status) {
        toast.success("Original URL retrieved successfully");
        setRetrivedLongUrl(response.data.longUrl);
      } else {
        toast.error(response.data?.message || "Failed to retrieve original URL");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "An error occurred");
    } finally {
      setLoadingLongUrl(false);
    }
  };

  const downloadQR = () => {
    const a = document.createElement("a");
    a.href = qrCode;
    a.download = "linkly-qr.png";
    a.click();
  };

  return (
    <main className="flex flex-col items-center justify-center px-4 py-16 bg-[#fafafa] dark:bg-[#000000] transition-colors font-sans min-h-[calc(100vh-140px)]">
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
          Advanced Routing
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Configure custom aliases, click limits, and expiration dates.
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
        
        {/* Shorten URL Panel */}
        <div className="glass-card p-6 md:p-8 rounded-xl flex flex-col h-full relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-md bg-black text-white dark:bg-white dark:text-black">
                <LinkIcon className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                Create Short Link
              </h2>
            </div>
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors flex items-center gap-1.5"
            >
              <Settings2 className="w-3.5 h-3.5" /> 
              Options
            </button>
          </div>

          <div className="space-y-4 flex-grow">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Destination URL</label>
              <input
                type="text"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://your-very-long-url.com/something"
                className="w-full px-3 py-2.5 rounded-md bg-[#fafafa] dark:bg-[#0a0a0a] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white border border-gray-200 dark:border-white/10 transition-all"
              />
            </div>

            {showAdvanced && (
              <div className="p-4 rounded-md bg-[#fafafa] dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Custom Alias</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-l-md border border-r-0 border-gray-200 dark:border-white/10 text-sm">{import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL.replace(/^https?:\/\//, '') + '/' : 'linkly.com/'}</span>
                    <input
                      type="text"
                      value={customShort}
                      onChange={(e) => setCustomShort(e.target.value)}
                      placeholder="my-brand"
                      className="w-full px-3 py-2 rounded-r-md bg-white dark:bg-black text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white border border-gray-200 dark:border-white/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Max Clicks (0 for unltd)</label>
                    <input
                      type="number"
                      value={maxClicks}
                      onChange={(e) => setMaxClicks(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-md bg-white dark:bg-black text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white border border-gray-200 dark:border-white/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Expiration Date</label>
                    <input
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-white dark:bg-black text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white border border-gray-200 dark:border-white/10 transition-all"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={oneTime}
                    onChange={(e) => {
                      setOneTime(e.target.checked);
                      setMaxClicks(e.target.checked ? "1" : "");
                    }}
                    className="rounded text-black focus:ring-black dark:text-white dark:focus:ring-white bg-white dark:bg-black border-gray-300 dark:border-gray-600"
                  />
                  Self-destruct after 1 click
                </label>
              </div>
            )}
          </div>

          <div className="pt-6 mt-auto">
            <button
              onClick={handleShortenUrl}
              disabled={loadingShortUrl}
              className={`w-full py-2.5 rounded-md bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black text-sm font-medium transition-colors ${loadingShortUrl ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loadingShortUrl ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2Icon className="h-4 w-4 animate-spin" /> Shortening...
                </span>
              ) : "Create Link"}
            </button>

            {generatedShortUrl && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-md border border-gray-200 dark:border-white/10">
                <p className="text-xs font-medium text-gray-500 mb-2">Ready to share</p>
                <div className="flex items-center justify-between gap-3 bg-white dark:bg-black p-2 rounded-md border border-gray-200 dark:border-white/10">
                  <a href={generatedShortUrl} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white font-mono text-xs truncate hover:underline">
                    {generatedShortUrl}
                  </a>
                  <button onClick={() => { navigator.clipboard.writeText(generatedShortUrl); toast.success("Copied"); }} className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors" title="Copy">
                    <CopyIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
                
                {qrCode && (
                  <div className="mt-4 flex flex-col items-center justify-center border-t border-gray-200 dark:border-white/10 pt-4">
                    <img src={qrCode} alt="QR Code" className="w-24 h-24 bg-white p-1 rounded-sm border border-gray-200 dark:border-white/10 mb-2" />
                    <button onClick={downloadQR} className="text-xs font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
                      Download QR Code
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Expand URL Panel */}
        <div className="glass-card p-6 md:p-8 rounded-xl flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-1.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300">
              <ExpandIcon className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
              Expand Link
            </h2>
          </div>

          <div className="space-y-4 flex-grow">
             <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Short URL</label>
              <input
                type="text"
                value={shortUrl}
                onChange={(e) => setShortUrl(e.target.value)}
                placeholder="https://linkly.com/abc123"
                className="w-full px-3 py-2.5 rounded-md bg-[#fafafa] dark:bg-[#0a0a0a] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white border border-gray-200 dark:border-white/10 transition-all"
              />
            </div>
          </div>

          <div className="pt-6 mt-auto">
            <button
              onClick={handleOriginalUrl}
              disabled={loadingLongUrl}
              className={`w-full py-2.5 rounded-md bg-white hover:bg-gray-50 dark:bg-[#0a0a0a] dark:hover:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 text-sm font-medium transition-colors ${loadingLongUrl ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loadingLongUrl ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2Icon className="h-4 w-4 animate-spin" /> Expanding...
                </span>
              ) : "Get Original URL"}
            </button>

            {retrivedLongUrl && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-md border border-gray-200 dark:border-white/10">
                <p className="text-xs font-medium text-gray-500 mb-2">Original Destination</p>
                <div className="flex items-center justify-between gap-3 bg-white dark:bg-black p-2 rounded-md border border-gray-200 dark:border-white/10">
                  <a href={retrivedLongUrl} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white font-mono text-xs truncate flex-1 hover:underline">
                    {retrivedLongUrl}
                  </a>
                  <button onClick={() => { navigator.clipboard.writeText(retrivedLongUrl); toast.success("Copied"); }} className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors" title="Copy">
                    <CopyIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}

export default UrlShortner;
