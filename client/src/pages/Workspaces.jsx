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
  const [generatedKey, setGeneratedKey] = useState(null); // One-time display
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
    <div className="max-w-3xl mx-auto p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">
          Workspaces
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Group your links and access them programmatically via API keys.
        </p>
      </div>

      {/* One-Time API Key Display */}
      {generatedKey && (
        <div className="mb-8 glass-card rounded-xl p-5 border border-amber-200 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-900/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                Save your API Key — it will not be shown again!
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mb-3">
                Use this key in the <code>Authorization: Bearer &lt;key&gt;</code> header to create links programmatically.
              </p>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-900 dark:bg-black/50 font-mono text-xs text-green-400 overflow-x-auto">
                <Key className="w-3.5 h-3.5 text-green-500 shrink-0" />
                <span className="flex-1 break-all">{generatedKey}</span>
                <button
                  onClick={copyKey}
                  className="shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
              <button
                onClick={() => setGeneratedKey(null)}
                className="mt-3 text-xs text-amber-600 dark:text-amber-400 hover:underline"
              >
                I have saved my key, dismiss this
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Workspace Form */}
      <div className="glass-card rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Create New Workspace
        </h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            id="workspace-name-input"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g., Diwali Sale Campaign"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white/20 transition-all"
          />
          <button
            type="submit"
            disabled={creating}
            id="create-workspace-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
      </div>

      {/* Workspaces List */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            Your Workspaces
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-medium text-gray-600 dark:text-gray-300">
              {workspaces.length}
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-black dark:border-white" />
          </div>
        ) : workspaces.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <FolderOpen className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No workspaces yet. Create one above.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-white/5">
            {workspaces.map((ws) => (
              <li key={ws.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5">
                    <FolderOpen className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{ws.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{ws.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                    {new Date(ws.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(ws.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete workspace"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
