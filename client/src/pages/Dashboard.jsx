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
  AlertCircle,
  HeartPulse,
  RefreshCw,
  Plus,
} from "lucide-react";

function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLinks, setTotalLinks] = useState(0);
  const [globalClicks, setGlobalClicks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState("");
  const [checkingHealth, setCheckingHealth] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
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

  const fetchUrls = async (page = 1, workspaceId = activeWorkspace) => {
    try {
      const token = localStorage.getItem("token");
      let url = `${import.meta.env.VITE_BASE_URL}/url/me?page=${page}&limit=${limit}`;
      if (workspaceId) url += `&workspaceId=${workspaceId}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const handleReVerifyHealth = async (shortUrl) => {
    setCheckingHealth((prev) => ({ ...prev, [shortUrl]: true }));
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/url/${shortUrl}/check-health`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.isHealthy) {
        toast.success("Link is healthy and back in monitoring");
      } else {
        toast.warning(res.data.message);
      }
      fetchUrls(currentPage);
    } catch {
      toast.error("Health check failed. Try again later.");
    } finally {
      setCheckingHealth((prev) => ({ ...prev, [shortUrl]: false }));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const now = new Date();
  const isExpired = (url) => {
    const expiredByDate = url.expiresAt && new Date(url.expiresAt) < now;
    const expiredByClicks = url.maxClicks && url.clicks >= url.maxClicks;
    return expiredByDate || expiredByClicks;
  };

  const activeUrls = urls.filter((url) => !isExpired(url));
  const expiredUrls = urls.filter((url) => isExpired(url));

  const renderUrlTable = (urlList, isExpiredSection = false) => {
    if (urlList.length === 0) {
      return (
        <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--text-muted)" }}>
          <LinkIcon style={{ width: 24, height: 24, margin: "0 auto 0.5rem", opacity: 0.4 }} />
          <p style={{ fontSize: "0.8125rem" }}>No links found in this category.</p>
        </div>
      );
    }

    return (
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 500 }}>
              <th style={{ padding: "0.625rem 1rem" }}>Short Link</th>
              <th style={{ padding: "0.625rem 1rem" }} className="hidden-sm">Destination</th>
              <th style={{ padding: "0.625rem 1rem" }}>Clicks</th>
              {isExpiredSection && <th style={{ padding: "0.625rem 1rem" }}>Status</th>}
              <th style={{ padding: "0.625rem 1rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ divideY: "1px solid var(--border)" }}>
            {urlList.map((url) => {
              const shortLink = `${import.meta.env.VITE_BACKEND_URL}/${url.shortUrl}`;
              return (
                <tr
                  key={url.id || url.shortUrl}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    opacity: isExpiredSection ? 0.7 : 1,
                    transition: "background 0.12s ease",
                  }}
                  className="table-row-hover"
                >
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      {url.favicon ? (
                        <img src={url.favicon} alt="" style={{ width: 18, height: 18, borderRadius: 3, objectFit: "contain" }} />
                      ) : (
                        <div style={{ width: 18, height: 18, borderRadius: 3, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyCenter: "center" }}>
                          <LinkIcon style={{ width: 10, height: 10, color: "var(--text-muted)" }} />
                        </div>
                      )}
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                          <span style={{ fontWeight: 500, color: "var(--text-primary)", textDecoration: isExpiredSection ? "line-through" : "none" }}>
                            {url.customShort || url.shortUrl}
                          </span>
                          {!isExpiredSection && (
                            <button
                              onClick={() => copyToClipboard(shortLink)}
                              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 2, display: "flex" }}
                              title="Copy short link"
                            >
                              <Copy style={{ width: 12, height: 12 }} />
                            </button>
                          )}
                          {checkingHealth[url.shortUrl] ? (
                            <span style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" }}>
                              Checking...
                            </span>
                          ) : url.monitorHealth && !url.isHealthy ? (
                            <span style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem", borderRadius: 4, background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", display: "inline-flex", alignItems: "center", gap: 2 }}>
                              <AlertCircle style={{ width: 9, height: 9 }} /> Broken
                            </span>
                          ) : url.monitorHealth && url.isHealthy ? (
                            <span style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem", borderRadius: 4, background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)", display: "inline-flex", alignItems: "center", gap: 2 }}>
                              <HeartPulse style={{ width: 9, height: 9 }} /> OK
                            </span>
                          ) : null}
                        </div>
                        <a
                          href={isExpiredSection ? "#" : shortLink}
                          target={isExpiredSection ? "_self" : "_blank"}
                          rel="noreferrer"
                          style={{ fontSize: "0.75rem", color: "var(--accent)", textDecoration: "none" }}
                        >
                          {import.meta.env.VITE_BACKEND_URL?.replace(/^https?:\/\//, "") || "linkly.sh"}/{url.customShort || url.shortUrl}
                        </a>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: "0.75rem 1rem", maxWidth: 220 }} className="hidden-sm">
                    <a
                      href={url.longUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}
                    >
                      {url.longUrl}
                    </a>
                  </td>

                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: 12, background: "rgba(255,255,255,0.06)", color: "var(--text-primary)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      {url.clicks} {url.maxClicks ? `/ ${url.maxClicks}` : ""} <BarChart2 style={{ width: 11, height: 11, color: "var(--text-muted)" }} />
                    </span>
                  </td>

                  {isExpiredSection && (
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span style={{ fontSize: "0.6875rem", padding: "0.15rem 0.45rem", borderRadius: 4, background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}>
                        {url.maxClicks && url.clicks >= url.maxClicks ? "Limit Reached" : "Expired"}
                      </span>
                    </td>
                  )}

                  <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" }}>
                      {!isExpiredSection && (
                        <button
                          onClick={() => {
                            const a = document.createElement("a");
                            a.href = url.qrCode;
                            a.download = `${url.shortUrl}-qr.png`;
                            a.click();
                          }}
                          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 3, display: "flex" }}
                          title="Download QR"
                        >
                          <QrCode style={{ width: 14, height: 14 }} />
                        </button>
                      )}

                      {url.monitorHealth && !url.isHealthy && !isExpiredSection && (
                        <button
                          onClick={() => handleReVerifyHealth(url.shortUrl)}
                          disabled={checkingHealth[url.shortUrl]}
                          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 3, display: "flex" }}
                          title="Re-verify health"
                        >
                          <RefreshCw style={{ width: 14, height: 14, animation: checkingHealth[url.shortUrl] ? "spin 1s linear infinite" : "none" }} />
                        </button>
                      )}

                      <Link
                        to={`/analytics/${url.shortUrl}`}
                        style={{ color: "var(--text-muted)", display: "flex", padding: 3 }}
                        title="Analytics"
                      >
                        <BarChart2 style={{ width: 14, height: 14 }} />
                      </Link>

                      <button
                        onClick={() => handleDelete(url.shortUrl)}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 3, display: "flex" }}
                        title="Delete"
                      >
                        <Trash2 style={{ width: 14, height: 14 }} />
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
      <div style={{ padding: "4rem 1rem", textAlign: "center", color: "var(--text-muted)" }}>
        <div style={{ width: 24, height: 24, border: "2px solid var(--border)", borderTopColor: "var(--text-primary)", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 0.25rem" }}>Overview</h1>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0 }}>Manage your links and performance.</p>

        {workspaces.length > 0 && (
          <div style={{ marginTop: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Workspace:</label>
            <select
              value={activeWorkspace}
              onChange={(e) => {
                setActiveWorkspace(e.target.value);
                fetchUrls(1, e.target.value);
              }}
              className="input"
              style={{ width: "auto", padding: "0.35rem 0.625rem", fontSize: "0.8125rem" }}
            >
              <option value="">All Links</option>
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>{ws.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="responsive-grid-2" style={{ marginBottom: "1.75rem" }}>
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>Total Links</span>
            <LinkIcon style={{ width: 14, height: 14, color: "var(--text-muted)" }} />
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>{totalLinks}</div>
        </div>

        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>Total Clicks</span>
            <BarChart2 style={{ width: 14, height: 14, color: "var(--text-muted)" }} />
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>{globalClicks}</div>
        </div>
      </div>

      {/* Active Links Card */}
      <div className="card" style={{ overflow: "hidden", marginBottom: "1.5rem" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Active Links</h3>
            <span className="badge">{activeUrls.length}</span>
          </div>
          <Link to="/home" className="btn-primary" style={{ textDecoration: "none", fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}>
            <Plus style={{ width: 12, height: 12 }} /> Create Link
          </Link>
        </div>
        {renderUrlTable(activeUrls, false)}
      </div>

      {/* Expired Links Card */}
      {expiredUrls.length > 0 && (
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Expired & Limit Reached</h3>
              <span className="badge" style={{ color: "#f87171" }}>{expiredUrls.length}</span>
            </div>
          </div>
          {renderUrlTable(expiredUrls, true)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem" }}>
          <button
            disabled={currentPage === 1}
            onClick={() => fetchUrls(currentPage - 1)}
            className="btn-ghost"
            style={{ fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}
          >
            Previous
          </button>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => fetchUrls(currentPage + 1)}
            className="btn-ghost"
            style={{ fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}
          >
            Next
          </button>
        </div>
      )}

      <style>{`
        .table-row-hover:hover { background: rgba(255,255,255,0.02); }
        @media (max-width: 640px) { .hidden-sm { display: none; } }
      `}</style>
    </div>
  );
}

export default Dashboard;
