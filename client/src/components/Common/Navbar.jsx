import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/UserContext";
import { Link as LinkIcon, Menu, X } from "lucide-react";

function Navbar() {
  const { user, loading } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return <div style={{ height: "56px", borderBottom: "1px solid var(--border)" }} />;
  }

  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}&backgroundColor=17171c&textColor=f0f0f2`;

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shorten URL", to: "/home" },
    ...(user ? [{ label: "Dashboard", to: "/dashboard" }] : []),
  ];

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(17,17,21,0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Brand */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div style={{ background: "var(--text-primary)", borderRadius: "7px", padding: "4px 5px", display: "flex", alignItems: "center" }}>
            <LinkIcon style={{ color: "var(--bg)", width: 14, height: 14 }} />
          </div>
          <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Linkly</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "none" }} className="md-nav">
          <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
            {navLinks.map(({ label, to }) => (
              <Link key={to} to={to} className="nav-link" style={{ textDecoration: "none", color: location.pathname === to ? "var(--text-primary)" : undefined }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {user ? (
            <Link to="/auth" style={{ textDecoration: "none" }}>
              <img src={avatar} alt="Profile" style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid var(--border-strong)" }} />
            </Link>
          ) : (
            <Link to="/auth" className="btn-primary" style={{ textDecoration: "none" }}>
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
          padding: "1rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
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
                color: location.pathname === to ? "var(--text-primary)" : "var(--text-secondary)",
                background: location.pathname === to ? "rgba(255,255,255,0.06)" : "transparent",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      {/* Responsive styles injected inline via a hidden style tag — Tailwind md: works via CDN but we use inline for clarity */}
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
