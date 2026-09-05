import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import QRCode from "qrcode";
import { AuthContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import {
  Link as LinkIcon,
  Expand as ExpandIcon,
  Copy as CopyIcon,
  Loader2 as Loader2Icon,
  Settings2,
  Lock,
} from "lucide-react";

function UrlShortner() {
  const [shortUrl, setShortUrl] = useState("");
  const [longUrl, setLongUrl] = useState("");
  const [generatedShortUrl, setGeneratedShortUrl] = useState("");
  const [retrivedLongUrl, setRetrivedLongUrl] = useState("");
  const [loadingShortUrl, setLoadingShortUrl] = useState(false);
  const [loadingLongUrl, setLoadingLongUrl] = useState(false);
  const qrCanvasRef = useRef(null);

  // Render QR code onto canvas whenever a short URL is generated
  useEffect(() => {
    if (!generatedShortUrl || !qrCanvasRef.current) return;
    QRCode.toCanvas(qrCanvasRef.current, generatedShortUrl, { width: 96, margin: 1 });
  }, [generatedShortUrl]);

  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customShort, setCustomShort] = useState("");
  const [maxClicks, setMaxClicks] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [oneTime, setOneTime] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const [monitorHealth, setMonitorHealth] = useState(false);
  const [linkPassword, setLinkPassword] = useState("");

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/workspaces`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkspaces(res.data.workspaces || []);
      } catch { /* non-critical */ }
    };
    fetchWorkspaces();
  }, [user]);

  const handleShortenUrl = async () => {
    if (!user) {
      toast.error("Please login to use the URL shortener");
      return;
    }
    if (!longUrl) {
      toast.error("Please enter a valid URL to shorten");
      return;
    }

    try {
      const parsedUrl = new URL(longUrl);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        toast.error("Only http:// and https:// protocols are supported");
        return;
      }
    } catch {
      toast.error("Please enter a valid absolute URL (e.g., https://example.com)");
      return;
    }

    setGeneratedShortUrl("");
    setLoadingShortUrl(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/url/shorten`,
        {
          longUrl,
          customShort: customShort || undefined,
          maxClicks: maxClicks ? Number(maxClicks) : undefined,
          expiresAt: expiresAt || undefined,
          workspaceId: selectedWorkspaceId || undefined,
          monitorHealth,
          password: linkPassword || undefined,
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
      const shortCode = shortUrl.split("/").pop();
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/url/original/${shortCode}`,
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

  const downloadQR = async () => {
    const dataUrl = await QRCode.toDataURL(generatedShortUrl);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "linkly-qr.png";
    a.click();
  };

  return (
    <main style={{
      minHeight: "calc(100vh - 60px)",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "3.5rem 1.5rem 5rem",
      position: "relative",
      zIndex: 2,
      fontFamily: "Plus Jakarta Sans, sans-serif",
    }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem", maxWidth: 560 }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.035em", color: "var(--text-primary)", margin: "0 0 0.5rem" }}>
          Shorten & Expand Links
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
          Configure custom aliases, click limits, expiration dates, and password locks.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        
        {/* Shorten URL Panel */}
        <div className="card" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ background: "var(--accent-glow)", border: "1px solid rgba(99,102,241,0.3)", padding: "5px", borderRadius: "6px", display: "flex" }}>
                <LinkIcon style={{ color: "var(--accent-light)", width: 14, height: 14 }} />
              </div>
              <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
                Create Short Link
              </h2>
            </div>
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: showAdvanced ? "var(--accent-light)" : "var(--text-secondary)",
                background: showAdvanced ? "var(--accent-glow)" : "rgba(255,255,255,0.04)",
                border: showAdvanced ? "1px solid rgba(99,102,241,0.3)" : "1px solid var(--border)",
                borderRadius: "6px",
                padding: "0.3rem 0.65rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <Settings2 style={{ width: 12, height: 12 }} /> 
              Options
            </button>
          </div>

          <div>
            <label className="label">Destination URL</label>
            <input
              type="text"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://your-very-long-url.com/something"
              className="input"
              onKeyDown={(e) => e.key === "Enter" && handleShortenUrl()}
            />
          </div>

          {showAdvanced && (
            <div style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "1.25rem",
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}>
              <div>
                <label className="label">Custom Alias</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className="alias-prefix" style={{ padding: "0.625rem 0.875rem", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRight: "none", borderRadius: "8px 0 0 8px", fontSize: "0.8125rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    linklyx.vercel.app/
                  </span>
                  <input
                    type="text"
                    value={customShort}
                    onChange={(e) => setCustomShort(e.target.value)}
                    placeholder="my-brand"
                    className="input"
                    style={{ borderRadius: "0 8px 8px 0", borderLeft: "none" }}
                  />
                </div>
              </div>

              <div className="responsive-grid-2">
                <div>
                  <label className="label">Max Clicks (0 for unltd)</label>
                  <input
                    type="number"
                    value={maxClicks}
                    onChange={(e) => setMaxClicks(e.target.value)}
                    placeholder="0"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Expiration Date</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Lock style={{ width: 11, height: 11 }} /> Password Protection (optional)
                </label>
                <input
                  type="password"
                  value={linkPassword}
                  onChange={(e) => setLinkPassword(e.target.value)}
                  placeholder="Leave blank for no password"
                  className="input"
                />
              </div>

              {workspaces.length > 0 && (
                <div>
                  <label className="label">Assign to Workspace</label>
                  <select
                    value={selectedWorkspaceId}
                    onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                    className="input"
                  >
                    <option value="">No workspace (personal)</option>
                    {workspaces.map((ws) => (
                      <option key={ws.id} value={ws.id}>{ws.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", paddingTop: "0.25rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={oneTime}
                    onChange={(e) => {
                      setOneTime(e.target.checked);
                      setMaxClicks(e.target.checked ? "1" : "");
                    }}
                    style={{ accentColor: "var(--accent)", width: 14, height: 14 }}
                  />
                  Self-destruct after 1 click
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={monitorHealth}
                    onChange={(e) => setMonitorHealth(e.target.checked)}
                    style={{ accentColor: "var(--accent)", width: 14, height: 14 }}
                  />
                  Monitor Link Health
                </label>
              </div>
            </div>
          )}

          <div style={{ marginTop: "1.25rem" }}>
            <button
              onClick={handleShortenUrl}
              disabled={loadingShortUrl}
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "0.625rem",
                fontSize: "0.875rem",
                opacity: loadingShortUrl ? 0.65 : 1,
              }}
            >
              {loadingShortUrl ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Loader2Icon style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> Shortening...
                </span>
              ) : "Create Link"}
            </button>

            {generatedShortUrl && (
              <div style={{
                marginTop: "1.25rem",
                padding: "1.25rem",
                background: "var(--bg-input)",
                borderRadius: "10px",
                border: "1px solid var(--border-glow)",
              }}>
                <p style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Ready to share</p>
                <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", gap: "0.5rem", background: "var(--bg-card)", padding: "0.625rem 0.875rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <a href={generatedShortUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-light)", fontFamily: "monospace", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {generatedShortUrl}
                  </a>
                  <button
                    onClick={() => { navigator.clipboard.writeText(generatedShortUrl); toast.success("Copied to clipboard"); }}
                    className="btn-ghost"
                    style={{ padding: "0.35rem 0.625rem", fontSize: "0.75rem" }}
                    title="Copy"
                  >
                    <CopyIcon style={{ width: 13, height: 13 }} />
                  </button>
                </div>
                
                {generatedShortUrl && (
                  <div style={{ marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <canvas ref={qrCanvasRef} style={{ borderRadius: 8, border: "1px solid var(--border)", background: "#ffffff", padding: 4 }} />
                    <button onClick={downloadQR} className="btn-ghost" style={{ fontSize: "0.75rem", padding: "0.3rem 0.75rem" }}>
                      Download QR Code
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Expand URL Panel */}
        <div className="card" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", padding: "5px", borderRadius: "6px", display: "flex" }}>
              <ExpandIcon style={{ color: "var(--text-secondary)", width: 14, height: 14 }} />
            </div>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
              Expand Link
            </h2>
          </div>

          <div>
            <label className="label">Short URL</label>
            <input
              type="text"
              value={shortUrl}
              onChange={(e) => setShortUrl(e.target.value)}
              placeholder="https://linklyx.vercel.app/abc123"
              className="input"
              onKeyDown={(e) => e.key === "Enter" && handleOriginalUrl()}
            />
          </div>

          <div style={{ marginTop: "1.25rem" }}>
            <button
              onClick={handleOriginalUrl}
              disabled={loadingLongUrl}
              className="btn-ghost"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "0.625rem",
                fontSize: "0.875rem",
                opacity: loadingLongUrl ? 0.65 : 1,
              }}
            >
              {loadingLongUrl ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Loader2Icon style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> Expanding...
                </span>
              ) : "Get Original URL"}
            </button>

            {retrivedLongUrl && (
              <div style={{
                marginTop: "1.25rem",
                padding: "1.25rem",
                background: "var(--bg-input)",
                borderRadius: "10px",
                border: "1px solid var(--border)",
              }}>
                <p style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Original Destination</p>
                <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", gap: "0.5rem", background: "var(--bg-card)", padding: "0.625rem 0.875rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <a href={retrivedLongUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-light)", fontSize: "0.8125rem", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                    {retrivedLongUrl}
                  </a>
                  <button onClick={() => { navigator.clipboard.writeText(retrivedLongUrl); toast.success("Copied to clipboard"); }} className="btn-ghost" style={{ padding: "0.35rem 0.625rem", fontSize: "0.75rem" }}>
                    <CopyIcon style={{ width: 13, height: 13 }} />
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
