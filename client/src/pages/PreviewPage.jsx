import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link as LinkIcon, Lock, ExternalLink } from "lucide-react";

export default function PreviewPage() {
  const { shortCode } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  // Password gate state
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/links/${shortCode}`
        );
        const data = await res.json();
        if (!res.ok) {
          setLink(null);
          setErrorMsg(data.error || "Link not found or expired.");
          return;
        }
        setLink(data);
        if (!data.isPasswordProtected) setUnlocked(true);
      } catch (err) {
        console.error("Error fetching link:", err);
        setErrorMsg("Failed to load link preview.");
      } finally {
        setLoading(false);
      }
    };
    fetchLink();
  }, [shortCode]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setPasswordError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/links/${shortCode}/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: passwordInput }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setLink((prev) => ({ ...prev, longUrl: data.longUrl }));
        setUnlocked(true);
      } else {
        setPasswordError(data.error || "Incorrect password");
      }
    } catch {
      setPasswordError("Something went wrong. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  // Countdown redirect
  useEffect(() => {
    if (!link?.longUrl || !unlocked) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = link.longUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [link, unlocked]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg)",
      }}>
        <div style={{
          width: 28, height: 28,
          border: "2.5px solid var(--border)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
  }

  if (!link) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "var(--bg)", padding: "1.5rem", textAlign: "center",
        fontFamily: "Plus Jakarta Sans, sans-serif",
      }}>
        <div className="card" style={{ padding: "2.5rem 2rem", maxWidth: 400, width: "100%", borderColor: "rgba(248,113,113,0.2)" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem",
          }}>
            <span style={{ fontSize: "1.25rem" }}>🚫</span>
          </div>
          <p style={{ fontSize: "1rem", fontWeight: 700, color: "#f87171", margin: "0 0 0.375rem" }}>Link Unavailable</p>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
            {errorMsg || "Link not found or expired."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "var(--bg)", padding: "1.5rem",
      fontFamily: "Plus Jakarta Sans, sans-serif",
      position: "relative",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 420 }}>
        {/* Gradient border wrapper */}
        <div style={{
          padding: "1px",
          borderRadius: 16,
          background: unlocked
            ? "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(99,102,241,0.1))"
            : "linear-gradient(135deg, rgba(245,158,11,0.35), rgba(99,102,241,0.15))",
        }}>
          <div className="card" style={{
            borderRadius: 15,
            padding: "2rem 1.75rem",
            textAlign: "center",
            border: "none",
            background: "var(--bg-card)",
          }}>
            {/* Favicon */}
            {link.favicon ? (
              <img
                src={link.favicon}
                alt="Preview"
                style={{
                  width: 56, height: 56, margin: "0 auto 1.25rem",
                  borderRadius: 12, objectFit: "cover",
                  border: "1px solid var(--border)",
                  background: "var(--bg-input)",
                }}
              />
            ) : (
              <div style={{
                width: 56, height: 56, margin: "0 auto 1.25rem",
                borderRadius: 12,
                background: "var(--accent-glow)",
                border: "1px solid rgba(99,102,241,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <LinkIcon style={{ width: 22, height: 22, color: "var(--accent-light)" }} />
              </div>
            )}

            <h1 style={{
              fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)",
              margin: "0 0 0.375rem", lineHeight: 1.3,
            }}>
              {link.title || "Untitled Page"}
            </h1>
            <p style={{
              fontSize: "0.8125rem", color: "var(--text-secondary)", margin: "0 0 1.75rem",
              lineHeight: 1.55,
            }}>
              {link.description || "No description available"}
            </p>

            {/* Password Gate */}
            {!unlocked ? (
              <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: "0.375rem", fontSize: "0.8125rem", color: "#fbbf24", fontWeight: 600,
                  padding: "0.5rem", borderRadius: 8,
                  background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
                }}>
                  <Lock style={{ width: 13, height: 13 }} />
                  Password protected
                </div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  className="input"
                  style={{ textAlign: "center" }}
                  autoFocus
                />
                {passwordError && (
                  <p style={{ fontSize: "0.75rem", color: "#f87171", margin: 0 }}>{passwordError}</p>
                )}
                <button
                  type="submit"
                  disabled={verifying || !passwordInput}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", opacity: verifying || !passwordInput ? 0.65 : 1 }}
                >
                  {verifying ? "Verifying..." : "Unlock Link"}
                </button>
              </form>
            ) : (
              <>
                <a
                  href={link.longUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    textDecoration: "none", width: "100%", justifyContent: "center",
                    padding: "0.6875rem 1.25rem", fontSize: "0.875rem",
                  }}
                >
                  Continue to Site
                  <ExternalLink style={{ width: 13, height: 13 }} />
                </a>
                <p style={{
                  fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.875rem",
                }}>
                  {countdown > 0
                    ? `Redirecting in ${countdown}s...`
                    : "Redirecting now..."}
                </p>
              </>
            )}

            <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "1.5rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
              via{" "}
              <span style={{ color: "var(--accent-light)", fontWeight: 600 }}>Linkly</span>{" "}
              · Smart URL Preview
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
