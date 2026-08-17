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

  const isActive = (item) =>
    location.pathname === item.path ||
    (item.name === "Analytics" && location.pathname.startsWith("/analytics")) ||
    (item.name === "Workspaces" && location.pathname.startsWith("/workspaces"));

  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}&backgroundColor=0f1117&textColor=818cf8`;

  const sidebarContent = (
    <div style={{
      width: 224,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(180deg, #13161f 0%, #0f1117 100%)",
      borderRight: "1px solid var(--border)",
    }}>
      {/* Logo */}
      <div style={{
        height: 60, padding: "0 1.25rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(135deg, #6d70ff, #4f46e5)",
            borderRadius: "8px", padding: "5px 6px",
            display: "flex", alignItems: "center",
            boxShadow: "0 2px 10px rgba(99,102,241,0.45)",
          }}>
            <LinkIcon style={{ color: "#ffffff", width: 14, height: 14 }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-primary)", letterSpacing: "-0.025em" }}>
            Linkly
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          style={{ display: "none", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
          className="sidebar-close"
        >
          <X style={{ width: 18, height: 18 }} />
        </button>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", padding: "0 0.75rem", margin: "0 0 0.5rem" }}>
          Navigation
        </p>
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "9px",
                fontSize: "0.8125rem",
                fontWeight: active ? 600 : 500,
                textDecoration: "none",
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "rgba(99,102,241,0.12)" : "transparent",
                border: active ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
                boxShadow: active ? "0 0 0 0px rgba(99,102,241,0)" : "none",
                transition: "all 0.14s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
            >
              {active && (
                <div style={{
                  position: "absolute", left: 0, top: "20%", bottom: "20%",
                  width: 3, borderRadius: 2,
                  background: "linear-gradient(180deg, #6d70ff, #4f46e5)",
                  boxShadow: "0 0 8px rgba(99,102,241,0.6)",
                }} />
              )}
              <item.icon style={{ width: 15, height: 15, color: active ? "var(--accent-light)" : "inherit", flexShrink: 0 }} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid var(--border)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "0.625rem",
          padding: "0.5rem 0.625rem", borderRadius: "9px", marginBottom: "0.375rem",
          background: "rgba(255,255,255,0.03)",
        }}>
          <img src={avatar} alt="Avatar" style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid rgba(99,102,241,0.3)", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>
              {user?.name}
            </p>
            <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.5rem", padding: "0.4375rem", borderRadius: "9px",
            fontSize: "0.8125rem", color: "var(--text-muted)",
            background: "transparent", border: "none", cursor: "pointer",
            transition: "color 0.12s ease, background 0.12s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
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
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          className="mobile-overlay"
        />
      )}

      {/* Desktop Sidebar */}
      <aside style={{ flexShrink: 0 }} className="sidebar-desktop">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside
        style={{
          position: "fixed", inset: "0 auto 0 0", zIndex: 50, width: 224,
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
        <header
          style={{
            height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 1.25rem",
            borderBottom: "1px solid var(--border)",
            background: "linear-gradient(180deg, #13161f 0%, #0f1117 100%)",
          }}
          className="mobile-header"
        >
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex" }}>
            <Menu style={{ width: 18, height: 18 }} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ background: "linear-gradient(135deg, #6d70ff, #4f46e5)", borderRadius: "6px", padding: "4px 5px", display: "flex" }}>
              <LinkIcon style={{ color: "#fff", width: 12, height: 12 }} />
            </div>
            <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.025em" }}>Linkly</span>
          </div>
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
