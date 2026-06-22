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

// Minimal monochromatic palette
const COLORS = ["#000000", "#333333", "#666666", "#999999", "#cccccc", "#ebebeb"];
const DARK_COLORS = ["#ffffff", "#cccccc", "#999999", "#666666", "#333333", "#1a1a1a"];

const Analytics = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reactive dark mode — updates if user toggles theme after page load
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const currentColors = isDark ? DARK_COLORS : COLORS;

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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-800 dark:text-gray-200 p-12">
        <h2 className="text-xl font-medium mb-2">Error loading analytics</h2>
        <p className="mb-6 text-sm text-gray-500">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 border-b border-black/5 dark:border-white/10 pb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 bg-white dark:bg-black rounded-md border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
            {shortCode ? "Link Analytics" : "Global Analytics"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {shortCode ? (
              <>Performance data for <span className="font-mono text-black dark:text-white bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded ml-1">{shortCode}</span></>
            ) : (
              "Aggregated performance data across all your links"
            )}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="glass-card p-6 rounded-xl inline-block min-w-[200px]">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-1">Total Clicks</p>
          <p className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">{data.totalClicks}</p>
        </div>
      </div>

      {data.totalClicks === 0 ? (
        <div className="glass-card rounded-xl p-16 text-center">
          <BarChart3 className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-1 text-gray-900 dark:text-white">No data available yet</h3>
          <p className="text-sm text-gray-500">Share your link to start gathering analytics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Timeline Chart */}
          <div className="glass-card rounded-xl p-6 md:col-span-2">
            <h3 className="text-sm font-semibold mb-6 text-gray-900 dark:text-white">Activity Over Time</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#e5e5e5"} vertical={false} />
                  <XAxis dataKey="date" stroke={isDark ? "#888" : "#666"} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickMargin={10} />
                  <YAxis stroke={isDark ? "#888" : "#666"} tick={{ fontSize: 12 }} allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDark ? '#000' : '#fff', borderColor: isDark ? '#333' : '#e5e5e5', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: isDark ? '#fff' : '#000' }}
                  />
                  <Line type="monotone" dataKey="clicks" stroke={isDark ? "#fff" : "#000"} strokeWidth={2} dot={{ r: 4, fill: isDark ? "#fff" : "#000", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Countries Chart */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <Globe size={16} className="text-gray-400" />
              Locations
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.countries} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? "#333" : "#e5e5e5"} />
                  <XAxis type="number" stroke={isDark ? "#888" : "#666"} allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" stroke={isDark ? "#888" : "#666"} width={80} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: isDark ? '#000' : '#fff', borderColor: isDark ? '#333' : '#e5e5e5', borderRadius: '8px', fontSize: '12px' }} cursor={{fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}}/>
                  <Bar dataKey="value" fill={isDark ? "#fff" : "#000"} radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Devices Chart */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <Smartphone size={16} className="text-gray-400" />
              Devices
            </h3>
            <div className="h-64 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.devices}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.devices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={currentColors[index % currentColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: isDark ? '#000' : '#fff', borderColor: isDark ? '#333' : '#e5e5e5', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="block text-2xl font-bold">{data.totalClicks}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2 flex-wrap">
              {data.devices.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentColors[index % currentColors.length] }}></div>
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Browsers Chart */}
          <div className="glass-card rounded-xl p-6 md:col-span-2">
             <h3 className="text-sm font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <Monitor size={16} className="text-gray-400" />
              Browsers & OS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <h4 className="text-xs font-medium text-gray-500 mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Browsers</h4>
                 <div className="space-y-1">
                   {data.browsers.map((b, i) => (
                     <div key={b.name} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm">
                       <span className="text-gray-700 dark:text-gray-300">{b.name}</span>
                       <span className="font-mono text-gray-500">{b.value}</span>
                     </div>
                   ))}
                 </div>
              </div>
              <div>
                 <h4 className="text-xs font-medium text-gray-500 mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Operating Systems</h4>
                 <div className="space-y-1">
                   {data.os.map((o, i) => (
                     <div key={o.name} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm">
                       <span className="text-gray-700 dark:text-gray-300">{o.name}</span>
                       <span className="font-mono text-gray-500">{o.value}</span>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Analytics;
