import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PreviewPage() {
  const { shortCode } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/links/${shortCode}`
        );
        const data = await res.json();
        setLink(data);
      } catch (err) {
        console.error("Error fetching link:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLink();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading preview...
      </div>
    );
  }

  if (!link) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400">
        Link not found or expired.
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
        <a
          href={link.longUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-all"
        >
          Continue to Site
        </a>
        <p className="text-gray-500 text-xs mt-4">
          via Linkly 🔗 Smart Preview
        </p>
      </div>
    </div>
  );
}
