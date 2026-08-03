import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
        // If not password protected, it's immediately unlocked
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
        // Merge the revealed longUrl and mark as unlocked
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

  // Start redirect countdown only once the link is loaded and unlocked
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--text-primary)" }}>
        <div style={{ width: 28, height: 28, border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
      </div>
    );
  }

  if (!link) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: "1.5rem", textAlign: "center", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
        <div className="card" style={{ padding: "2.5rem 1.5rem", maxWidth: 420, width: "100%" }}>
          <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "#f87171", margin: "0 0 0.5rem" }}>🚫 Link Unavailable</p>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0 }}>{errorMsg || "Link not found or expired."}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: "1.5rem", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="card" style={{ padding: "2rem 1.5rem", maxWidth: 440, width: "100%", textAlign: "center" }}>
        <img
          src={link.favicon || import.meta.env.VITE_DEFAULT_PREVIEW_IMG}
          alt="Preview"
          style={{ width: 56, height: 56, margin: "0 auto 1rem", borderRadius: 10, objectFit: "cover" }}
        />
        <h1 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.375rem" }}>
          {link.title || "Untitled Page"}
        </h1>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: "0 0 1.5rem", lineHeight: 1.5 }}>
          {link.description || "No description available"}
        </p>

        {/* Password Gate */}
        {!unlocked ? (
          <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={{ fontSize: "0.8125rem", color: "var(--accent-light)", margin: 0 }}>🔒 This link is password protected</p>
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
              style={{ width: "100%", justifyContent: "center" }}
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
              style={{ textDecoration: "none", width: "100%", justifyContent: "center", padding: "0.625rem 1.25rem", fontSize: "0.875rem" }}
            >
              Continue to Site
            </a>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1rem", margin: "1rem 0 0" }}>
              {countdown > 0
                ? `Redirecting in ${countdown}s...`
                : "Redirecting now..."}
            </p>
          </>
        )}

        <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "1.25rem" }}>via Linkly 🔗 Smart Preview</p>
      </div>
    </div>
  );
}
