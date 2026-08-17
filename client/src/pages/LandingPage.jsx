import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Common/Navbar";
import {
  ArrowRight,
  BarChart2,
  Shield,
  Zap,
  Lock,
  HeartPulse,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

// Feature Cards Data
const features = [
  {
    icon: Zap,
    title: "Edge Redirect Engine",
    tag: "High Performance",
    desc: "Fast global redirects powered by Redis and background queues. Built for smooth performance on every click.",
  },
  {
    icon: BarChart2,
    title: "Real-time Analytics",
    tag: "Deep Insights",
    desc: "Track device breakdown, browsers, operating systems, referrers, and live click activity with zero log latency.",
  },
  {
    icon: Lock,
    title: "Password Protection",
    desc: "Gate sensitive or private links behind custom passwords. Recipients must unlock the link before redirecting.",
    tag: "Security",
  },
  {
    icon: HeartPulse,
    title: "Link Health Monitor",
    tag: "Automated Check",
    desc: "Background workers auto-ping destination URLs. Get alerted immediately if your target website goes down or returns 404.",
  },
  {
    icon: Shield,
    title: "Click & Expiry Rules",
    tag: "Control",
    desc: "Set automatic self-destruct after N clicks or schedule expiry dates. Automatically get email alerts via Resend when limits hit.",
  },
  {
    icon: FolderOpen,
    title: "Team Workspaces",
    tag: "Collaboration",
    desc: "Organize links by project or client workspace. Manage permissions and switch context seamlessly in one unified dashboard.",
  },
];

// FAQs Data
const faqs = [
  {
    q: "Is Linkly completely free to use?",
    a: "Yes! Linkly is open-source and free for personal and team use. You can create unlimited links, custom aliases, and password-protected URLs.",
  },
  {
    q: "How does password protection work?",
    a: "When password protection is enabled, visitors are prompted with a secure password gate page. The actual destination URL is only revealed after successful password verification.",
  },
  {
    q: "What happens when a link hits its click limit or expiration date?",
    a: "The link automatically stops redirecting and shows a clean, friendly limit-reached screen. Additionally, Linkly automatically sends an email notification to your account.",
  },
  {
    q: "What analytics data can I track for my links?",
    a: "You can track total click volume, daily activity trends, device types (Desktop, Mobile, Tablet), browser breakdown, and traffic referrers in real-time.",
  },
];

function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [copied, setCopied] = useState(false);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", color: "var(--text-primary)", position: "relative" }}>
      
      {/* Ambient background glow blobs */}
      <div className="glow-blob" style={{ top: -100, left: "50%", transform: "translateX(-50%)" }} />
      <div className="glow-blob" style={{ top: 800, right: -150 }} />

      <Navbar />

      {/* Hero Section */}
      <section style={{ padding: "5rem 1.5rem 4rem", textAlign: "center", position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto" }}>
        
        {/* Top pill badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.85rem", borderRadius: "20px", background: "var(--accent-glow)", border: "1px solid rgba(99, 102, 241, 0.3)", marginBottom: "1.75rem" }}>
          <Sparkles style={{ width: 13, height: 13, color: "var(--accent-light)" }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent-light)" }}>Linkly 2.0 · Open Source URL Infrastructure</span>
        </div>

        {/* Hero Heading with Classic Serif Font */}
        <h1 style={{ fontSize: "clamp(2.75rem, 6vw, 4.75rem)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.045em", margin: "0 0 1.5rem" }}>
          The modern platform for{" "}
          <span className="serif-classic" style={{ fontStyle: "italic", fontWeight: 400, color: "var(--accent-light)", background: "linear-gradient(135deg, #a5b4fc 0%, #818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            intelligent short links.
          </span>
        </h1>

        <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", maxWidth: 580, margin: "0 auto 2.5rem", lineHeight: 1.6, fontWeight: 400 }}>
          Create custom aliases, set password gates, monitor target site health, and analyze real-time click metrics with zero latency.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "0.875rem" }}>
          <Link to="/home" className="btn-primary" style={{ textDecoration: "none", padding: "0.75rem 1.5rem", fontSize: "0.875rem" }}>
            Start Shortening Free <ArrowRight style={{ width: 15, height: 15 }} />
          </Link>
          <a
            href="https://github.com/Shobhit070304/Linkly"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            style={{ textDecoration: "none", padding: "0.75rem 1.5rem", fontSize: "0.875rem" }}
          >
            Star on GitHub
          </a>
        </div>

        {/* Key Metrics */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "3rem", marginTop: "3.5rem", borderTop: "1px solid var(--border)", paddingTop: "2.5rem" }}>
          {[
            ["< 5ms", "Edge Latency"],
            ["100%", "Open Source"],
            ["Real-time", "Click Analytics"],
            ["SHA-256", "Password Protection"],
          ].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.625rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)", background: "linear-gradient(135deg, #a5b4fc, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{val}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.3rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Live Product Preview Card Mockup */}
      <section style={{ maxWidth: 880, margin: "0 auto 6rem", padding: "0 1.5rem", width: "100%", position: "relative", zIndex: 2 }}>
        <div className="card" style={{ padding: "1.5rem", background: "linear-gradient(180deg, #1c1f26 0%, #171a21 100%)", border: "1px solid var(--border-strong)", borderRadius: 16 }}>
          {/* Mockup Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", paddingBottom: "0.875rem", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "0.5rem", fontFamily: "monospace" }}>app.linkly.sh / preview</span>
            </div>
            <span className="badge">⚡ Live Demo Preview</span>
          </div>

          {/* Interactive Card */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            <div style={{ background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.25rem" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem", fontWeight: 600, textTransform: "uppercase" }}>Active Short Link</div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--accent-light)", fontFamily: "monospace", marginBottom: "0.5rem" }}>
                linkly1.vercel.app/demo
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Target: https://mycompany.com/blog/2026-announcement
              </p>
            </div>

            <div style={{ background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem", fontWeight: 600, textTransform: "uppercase" }}>Click Analytics</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>1,482 <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>total clicks</span></div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Devices: 68% Desktop · 32% Mobile</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--accent-glow)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChart2 style={{ width: 22, height: 22, color: "var(--accent-light)" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section style={{ maxWidth: 1000, margin: "0 auto 6rem", padding: "0 1.5rem", width: "100%", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="badge" style={{ marginBottom: "0.75rem", display: "inline-block" }}>Full-Featured Platform</span>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 0.75rem" }}>
            Engineered for reliability and speed.
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
            Everything you need to create, protect, analyze, and manage your links.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {features.map(({ icon: Icon, title, desc, tag }) => (
            <div key={title} className="card-hover" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--accent-glow)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon style={{ width: 18, height: 18, color: "var(--accent-light)" }} />
                  </div>
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", border: "1px solid var(--border)", padding: "0.15rem 0.45rem", borderRadius: 4 }}>{tag}</span>
                </div>
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>{title}</h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works - 3 Step Workflow */}
      <section style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "5rem 1.5rem", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <span className="badge" style={{ marginBottom: "0.75rem", display: "inline-block" }}>Simple 3-Step Setup</span>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 3rem" }}>
            How Linkly works in practice
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem", textAlign: "left" }}>
            {[
              { num: "01", title: "Paste Destination URL", text: "Enter your long URL and optionally add a custom alias, expiration date, or password lock." },
              { num: "02", title: "Share Anywhere", text: "Get an instant short URL + auto-generated QR code ready for social posts, emails, or campaigns." },
              { num: "03", title: "Analyze & Monitor", text: "Track real-time click counts, country breakdown, and get automated health checks if the target drops." },
            ].map(({ num, title, text }) => (
              <div key={num} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.5rem" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)", marginBottom: "0.75rem", fontFamily: "monospace" }}>{num}</div>
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>{title}</h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "5rem 1.5rem", width: "100%", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 0.5rem" }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>Everything you need to know about Linkly.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {faqs.map(({ q, a }, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={q}
                className="card"
                style={{ cursor: "pointer", transition: "border-color 0.15s ease" }}
                onClick={() => toggleFaq(idx)}
              >
                <div style={{ padding: "1.125rem 1.25rem", display: "flex", alignItems: "center", justifyBetween: "space-between", gap: "1rem" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", flex: 1 }}>{q}</span>
                  {isOpen ? (
                    <ChevronUp style={{ width: 16, height: 16, color: "var(--accent-light)", flexShrink: 0 }} />
                  ) : (
                    <ChevronDown style={{ width: 16, height: 16, color: "var(--text-muted)", flexShrink: 0 }} />
                  )}
                </div>
                {isOpen && (
                  <div style={{ padding: "0 1.25rem 1.125rem", fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.65, borderTop: "1px solid var(--border)", paddingTop: "0.875rem" }}>
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ maxWidth: 880, margin: "0 auto 6rem", padding: "0 1.5rem", width: "100%", position: "relative", zIndex: 2 }}>
        <div className="card" style={{ padding: "3.5rem 2rem", textAlign: "center", background: "linear-gradient(135deg, #1c1f26 0%, #181a20 100%)", border: "1px solid var(--border-glow)" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 1rem" }}>
            Ready to shorten your first link?
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: 460, margin: "0 auto 2rem" }}>
            No credit card required. Create short links with password protection and custom expiration dates in seconds.
          </p>
          <Link to="/home" className="btn-primary" style={{ textDecoration: "none", padding: "0.75rem 1.75rem", fontSize: "0.875rem" }}>
            Get Started Now <ArrowRight style={{ width: 15, height: 15 }} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "2rem 1.5rem", textAlign: "center", background: "var(--bg-card)", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>Linkly 🔗</span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>© {new Date().getFullYear()} Linkly. Open Source URL Shortening Infrastructure.</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
