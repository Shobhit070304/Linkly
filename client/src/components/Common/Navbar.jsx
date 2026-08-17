import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/UserContext";
import { Link as LinkIcon, Menu, X } from "lucide-react";

function Navbar() {
  const { user, loading } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return <div style={{ height: "60px", borderBottom: "1px solid var(--border)" }} />;
  }

  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}&backgroundColor=0f1117&textColor=818cf8`;

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shorten URL", to: "/home" },
    ...(user ? [{ label: "Dashboard", to: "/dashboard" }] : []),
  ];

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(10, 12, 18, 0.88)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem",
        height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>

        {/* Brand */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(135deg, #6d70ff, #4f46e5)",
            borderRadius: "8px", padding: "5px 6px",
            display: "flex", alignItems: "center",
            boxShadow: "0 2px 10px rgba(99,102,241,0.4)",
          }}>
            <LinkIcon style={{ color: "#ffffff", width: 14, height: 14 }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", letterSpacing: "-0.025em" }}>
            Linkly
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "none" }} className="md-nav">
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {navLinks.map(({ label, to }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    textDecoration: "none",
                    padding: "0.4rem 0.875rem",
                    borderRadius: "8px",
                    fontSize: "0.8125rem",
                    fontWeight: active ? 600 : 500,
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    background: active ? "rgba(255,255,255,0.06)" : "transparent",
                    transition: "all 0.14s ease",
                  }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; } }}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; } }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Auth + Mobile Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          {user ? (
            <Link to="/auth" style={{ textDecoration: "none" }}>
              <img
                src={avatar}
                alt="Profile"
                style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.4)" }}
              />
            </Link>
          ) : (
            <Link to="/auth" className="btn-primary" style={{ textDecoration: "none", padding: "0.4375rem 1rem", fontSize: "0.8125rem" }}>
              Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
            className="md-hide"
          >
            {menuOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          padding: "0.75rem 1rem",
          display: "flex", flexDirection: "column", gap: "0.125rem",
        }}>
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: "none",
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: location.pathname === to ? 600 : 500,
                color: location.pathname === to ? "var(--text-primary)" : "var(--text-secondary)",
                background: location.pathname === to ? "rgba(99,102,241,0.1)" : "transparent",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .md-nav { display: flex !important; }
          .md-hide { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
