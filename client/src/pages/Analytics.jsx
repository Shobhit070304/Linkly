import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowLeft, BarChart3, Globe, Smartphone, Monitor } from "lucide-react";

const CHART_COLORS = ["#6366f1", "#818cf8", "#a5b4fc", "#4f46e5", "#3730a3", "#1e1b4b"];

const StatCard = ({ label, value }) => (
  <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
    <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.375rem" }}>
      {label}
    </p>
    <p style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.05em", color: "var(--text-primary)", margin: 0, lineHeight: 1 }}>
      {value}
    </p>
  </div>
);

const Analytics = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint = shortCode
          ? `${import.meta.env.VITE_BASE_URL}/url/analytics/${shortCode}`
          : `${import.meta.env.VITE_BASE_URL}/url/analytics/me`;

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [shortCode]);

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "var(--bg-card)",
      borderColor: "var(--border-strong)",
      borderRadius: "10px",
      fontSize: "12px",
      color: "var(--text-primary)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    },
    itemStyle: { color: "var(--text-primary)" },
    labelStyle: { color: "var(--text-muted)" },
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", flex: 1 }}>
        <div style={{ width: 28, height: 28, border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", flex: 1, textAlign: "center" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>Error loading analytics</h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: "0 0 1.5rem" }}>{error}</p>
        <button onClick={() => navigate("/dashboard")} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "Plus Jakarta Sans, sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-ghost"
          style={{ padding: "0.4rem 0.75rem", flexShrink: 0 }}
        >
          <ArrowLeft style={{ width: 15, height: 15 }} />
        </button>
        <div>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 0.125rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {shortCode ? "Link Analytics" : "Global Analytics"}
          </h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0 }}>
            {shortCode ? (
              <>Performance data for{" "}
                <code style={{ fontFamily: "monospace", color: "var(--accent-light)", background: "var(--accent-glow)", padding: "0.1rem 0.4rem", borderRadius: 4 }}>
                  {shortCode}
                </code>
              </>
            ) : "Aggregated performance across all your links"}
          </p>
        </div>
      </div>

      {/* Total Clicks */}
      <div style={{ marginBottom: "1.5rem" }}>
        <StatCard label="Total Clicks" value={data.totalClicks.toLocaleString()} />
      </div>

      {data.totalClicks === 0 ? (
        <div className="card" style={{ padding: "5rem 1rem", textAlign: "center" }}>
          <BarChart3 style={{ width: 28, height: 28, color: "var(--text-muted)", margin: "0 auto 0.75rem", opacity: 0.5 }} />
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 0.25rem" }}>No data yet</h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0 }}>Share your link to start gathering analytics.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "1.25rem" }}>

          {/* Timeline — full width */}
          <div className="card" style={{ padding: "1.5rem", gridColumn: "1 / -1" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BarChart3 style={{ width: 15, height: 15, color: "var(--accent-light)" }} />
              Activity Over Time
            </h3>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickMargin={10} />
                  <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Line
                    type="monotone" dataKey="clicks"
                    stroke="#6366f1" strokeWidth={2.5}
                    dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#818cf8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Locations */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Globe style={{ width: 15, height: 15, color: "var(--accent-light)" }} />
              Locations
            </h3>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.countries} layout="vertical" margin={{ left: 0, right: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="var(--text-muted)" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" stroke="var(--text-muted)" width={70} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 5, 5, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Devices Pie */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Smartphone style={{ width: 15, height: 15, color: "var(--accent-light)" }} />
              Devices
            </h3>
            <div style={{ height: 220, position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.devices} cx="50%" cy="50%"
                    innerRadius={62} outerRadius={82}
                    paddingAngle={3} dataKey="value" stroke="none"
                  >
                    {data.devices.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <span style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
                  {data.totalClicks}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
              {data.devices.map((entry, index) => (
                <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: CHART_COLORS[index % CHART_COLORS.length] }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </div>

          {/* Browsers & OS — full width */}
          <div className="card" style={{ padding: "1.5rem", gridColumn: "1 / -1" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Monitor style={{ width: 15, height: 15, color: "var(--accent-light)" }} />
              Browsers &amp; OS
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
              {[{ label: "Browsers", rows: data.browsers }, { label: "Operating Systems", rows: data.os }].map(({ label, rows }) => (
                <div key={label}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border)" }}>
                    {label}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    {rows.map((r) => (
                      <div key={r.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.375rem 0.5rem", borderRadius: 6, transition: "background 0.12s" }} className="table-row-hover">
                        <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{r.name}</span>
                        <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--accent-light)", fontWeight: 600 }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`.table-row-hover:hover { background: rgba(255,255,255,0.03); }`}</style>
    </div>
  );
};

export default Analytics;
