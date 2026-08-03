import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/UserContext";
import {
  Link as LinkIcon,
  Home,
  BarChart2,
  FolderOpen,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Analytics", path: "/analytics", icon: BarChart2 },
    { name: "Workspaces", path: "/workspaces", icon: FolderOpen },
  ];

  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}&backgroundColor=17171c&textColor=f0f0f2`;

  const sidebarContent = (
    <div style={{
      width: 220,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-card)",
      borderRight: "1px solid var(--border)",
    }}>
      {/* Logo */}
      <div style={{ height: 56, padding: "0 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div style={{ background: "var(--text-primary)", borderRadius: "6px", padding: "4px 5px", display: "flex", alignItems: "center" }}>
            <LinkIcon style={{ color: "var(--bg)", width: 13, height: 13 }} />
          </div>
          <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Linkly</span>
        </Link>
        <button onClick={() => setSidebarOpen(false)} style={{ display: "none", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }} className="sidebar-close">
          <X style={{ width: 18, height: 18 }} />
        </button>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "0.75rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.125rem" }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
            || (item.name === "Analytics" && location.pathname.startsWith("/analytics"))
            || (item.name === "Workspaces" && location.pathname.startsWith("/workspaces"));
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.4375rem 0.75rem",
                borderRadius: "8px",
                fontSize: "0.8125rem",
                fontWeight: isActive ? 500 : 400,
                textDecoration: "none",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                background: isActive ? "rgba(255,255,255,0.07)" : "transparent",
                transition: "background 0.12s ease, color 0.12s ease",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
            >
              <item.icon style={{ width: 15, height: 15, opacity: isActive ? 1 : 0.6 }} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0.625rem", borderRadius: "8px", marginBottom: "0.375rem" }}>
          <img src={avatar} alt="Avatar" style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border-strong)" }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>{user?.name}</p>
            <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.4375rem", borderRadius: "8px", fontSize: "0.8125rem", color: "var(--text-secondary)", background: "transparent", border: "none", cursor: "pointer", transition: "color 0.12s ease, background 0.12s ease" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut style={{ width: 14, height: 14 }} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar — Desktop: static, Mobile: fixed */}
      <aside style={{ flexShrink: 0 }} className="sidebar-desktop">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside
        style={{
          position: "fixed", inset: "0 auto 0 0", zIndex: 50, width: 220,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
        }}
        className="sidebar-mobile"
      >
        {sidebarContent}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Mobile header */}
        <header style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1rem", borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }} className="mobile-header">
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex" }}>
            <Menu style={{ width: 18, height: 18 }} />
          </button>
          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Linkly</span>
          <div style={{ width: 18 }} />
        </header>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </div>
      </main>

      <style>{`
        .sidebar-desktop { display: flex; }
        .sidebar-mobile { display: none; }
        .mobile-header { display: none; }
        .mobile-overlay { display: none; }
        .sidebar-close { display: none; }
        @media (max-width: 767px) {
          .sidebar-desktop { display: none; }
          .sidebar-mobile { display: flex; }
          .mobile-header { display: flex; }
          .mobile-overlay { display: block; }
          .sidebar-close { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
