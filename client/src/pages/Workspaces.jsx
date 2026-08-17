import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/UserContext";
import { Plus, Trash2, Key, Copy, Check, FolderOpen, AlertTriangle } from "lucide-react";

export default function Workspaces() {
  const { user } = useContext(AuthContext);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [generatedKey, setGeneratedKey] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const fetchWorkspaces = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/workspaces`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkspaces(res.data.workspaces || []);
    } catch {
      toast.error("Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return toast.error("Please enter a workspace name");
    setCreating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/workspaces/create`,
        { name: newName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status) {
        setGeneratedKey(res.data.apiKey);
        setNewName("");
        fetchWorkspaces();
        toast.success("Workspace created!");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create workspace");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workspace and ALL its links? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/workspaces/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Workspace deleted");
      fetchWorkspaces();
    } catch {
      toast.error("Failed to delete workspace");
    }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 0.25rem" }}>
          Workspaces
        </h1>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0 }}>
          Group your links and access them programmatically via API keys.
        </p>
      </div>

      {/* One-Time API Key Banner */}
      {generatedKey && (
        <div style={{
          marginBottom: "1.5rem",
          padding: "1.25rem",
          borderRadius: 12,
          background: "rgba(245,158,11,0.07)",
          border: "1px solid rgba(245,158,11,0.3)",
        }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <AlertTriangle style={{ width: 18, height: 18, color: "#f59e0b", flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fbbf24", margin: "0 0 0.25rem" }}>
                Save your API Key — it will not be shown again!
              </p>
              <p style={{ fontSize: "0.75rem", color: "#d97706", margin: "0 0 0.75rem", lineHeight: 1.5 }}>
                Use this key in the <code style={{ background: "rgba(0,0,0,0.3)", padding: "0.1rem 0.3rem", borderRadius: 4 }}>Authorization: Bearer &lt;key&gt;</code> header.
              </p>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.75rem 1rem", borderRadius: 8,
                background: "#0a0e18",
                border: "1px solid rgba(255,255,255,0.06)",
                fontFamily: "monospace", fontSize: "0.75rem", color: "#4ade80",
                overflowX: "auto",
              }}>
                <Key style={{ width: 13, height: 13, color: "#4ade80", flexShrink: 0 }} />
                <span style={{ flex: 1, wordBreak: "break-all" }}>{generatedKey}</span>
                <button
                  onClick={copyKey}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "0.25rem", borderRadius: 4, color: copiedKey ? "#4ade80" : "#94a3b8", transition: "color 0.15s" }}
                  title="Copy to clipboard"
                >
                  {copiedKey ? <Check style={{ width: 15, height: 15 }} /> : <Copy style={{ width: 15, height: 15 }} />}
                </button>
              </div>
              <button
                onClick={() => setGeneratedKey(null)}
                style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "#f59e0b", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
              >
                I have saved my key, dismiss this
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Form */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 1rem" }}>
          Create New Workspace
        </h2>
        <form onSubmit={handleCreate} style={{ display: "flex", gap: "0.625rem" }}>
          <input
            id="workspace-name-input"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g., Diwali Sale Campaign"
            className="input"
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            disabled={creating}
            id="create-workspace-btn"
            className="btn-primary"
            style={{ padding: "0.5625rem 1rem", whiteSpace: "nowrap", opacity: creating ? 0.65 : 1 }}
          >
            <Plus style={{ width: 14, height: 14 }} />
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
      </div>

      {/* Workspaces List */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <h2 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
            Your Workspaces
          </h2>
          <span className="badge">{workspaces.length}</span>
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem" }}>
            <div style={{ width: 24, height: 24, border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : workspaces.length === 0 ? (
          <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--text-muted)" }}>
            <FolderOpen style={{ width: 24, height: 24, margin: "0 auto 0.5rem", opacity: 0.4 }} />
            <p style={{ fontSize: "0.8125rem", margin: 0 }}>No workspaces yet. Create one above.</p>
          </div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {workspaces.map((ws) => (
              <li
                key={ws.id}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.875rem 1.25rem",
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.12s ease",
                }}
                className="table-row-hover"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: "var(--accent-glow)", border: "1px solid rgba(99,102,241,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <FolderOpen style={{ width: 15, height: 15, color: "var(--accent-light)" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{ws.name}</p>
                    <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", margin: 0, fontFamily: "monospace" }}>
                      {ws.id}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                    {new Date(ws.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(ws.id)}
                    style={{
                      background: "none", border: "none", cursor: "pointer", padding: "0.375rem",
                      borderRadius: 6, color: "var(--text-muted)",
                      transition: "color 0.12s ease, background 0.12s ease", display: "flex",
                    }}
                    title="Delete workspace"
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <Trash2 style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style>{`.table-row-hover:hover { background: rgba(255,255,255,0.02); }`}</style>
    </div>
  );
}
