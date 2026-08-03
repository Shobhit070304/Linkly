import { Github, Linkedin, Link as LinkIcon } from "lucide-react";
import React from "react";

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg)", padding: "2rem 1.5rem", fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "auto", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        {/* Logo and tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ background: "var(--text-primary)", borderRadius: 6, padding: "3px 4px", display: "flex" }}>
            <LinkIcon style={{ color: "var(--bg)", width: 12, height: 12 }} />
          </div>
          <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.875rem" }}>
            Linkly
          </span>
        </div>

        {/* Social Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a
            href="https://github.com/Shobhit070304"
            style={{ color: "var(--text-muted)", transition: "color 0.12s ease", display: "flex" }}
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <Github style={{ width: 16, height: 16 }} />
          </a>
          <a
            href="https://www.linkedin.com/in/shobhit-kumar-sharma-17bb4223a"
            style={{ color: "var(--text-muted)", transition: "color 0.12s ease", display: "flex" }}
            aria-label="LinkedIn"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <Linkedin style={{ width: 16, height: 16 }} />
          </a>
        </div>

        {/* Copyright */}
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} Linkly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
