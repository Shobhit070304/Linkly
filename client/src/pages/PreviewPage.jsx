import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PreviewPage() {
  const { shortCode } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  // Password gate state
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/links/${shortCode}`
        );
        const data = await res.json();
        if (!res.ok) {
          setLink(null);
          setErrorMsg(data.error || "Link not found or expired.");
          return;
        }
        setLink(data);
        // If not password protected, it's immediately unlocked
        if (!data.isPasswordProtected) setUnlocked(true);
      } catch (err) {
        console.error("Error fetching link:", err);
        setErrorMsg("Failed to load link preview.");
      } finally {
        setLoading(false);
      }
    };
    fetchLink();
  }, [shortCode]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setPasswordError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/links/${shortCode}/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: passwordInput }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        // Merge the revealed longUrl and mark as unlocked
        setLink((prev) => ({ ...prev, longUrl: data.longUrl }));
        setUnlocked(true);
      } else {
        setPasswordError(data.error || "Incorrect password");
      }
    } catch {
      setPasswordError("Something went wrong. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  // Start redirect countdown only once the link is loaded and unlocked
  useEffect(() => {
    if (!link?.longUrl || !unlocked) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = link.longUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [link, unlocked]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading preview...
      </div>
    );
  }

  if (!link) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-red-400 px-4 text-center font-sans">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full border border-gray-700">
          <p className="text-xl font-bold text-red-400 mb-2">🚫 Link Unavailable</p>
          <p className="text-gray-300 text-sm">{errorMsg || "Link not found or expired."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 px-4">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 max-w-lg w-full text-center">
        <img
          src={link.favicon || import.meta.env.VITE_DEFAULT_PREVIEW_IMG}
          alt="Preview"
          className="h-16 w-16 mx-auto mb-4 rounded-lg"
        />
        <h1 className="text-xl font-bold text-white mb-2">
          {link.title || "Untitled Page"}
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {link.description || "No description available"}
        </p>

        {/* Password Gate */}
        {!unlocked ? (
          <form onSubmit={handleVerify} className="flex flex-col gap-3">
            <p className="text-gray-300 text-sm">🔒 This link is password protected</p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              autoFocus
            />
            {passwordError && (
              <p className="text-red-400 text-xs">{passwordError}</p>
            )}
            <button
              type="submit"
              disabled={verifying || !passwordInput}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg transition-all text-sm font-medium"
            >
              {verifying ? "Verifying..." : "Unlock"}
            </button>
          </form>
        ) : (
          <>
            <a
              href={link.longUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-all"
            >
              Continue to Site
            </a>
            <p className="text-gray-500 text-xs mt-4">
              {countdown > 0
                ? `Redirecting in ${countdown}s...`
                : "Redirecting now..."}
            </p>
          </>
        )}

        <p className="text-gray-600 text-xs mt-4">via Linkly 🔗 Smart Preview</p>
      </div>
    </div>
  );
}
