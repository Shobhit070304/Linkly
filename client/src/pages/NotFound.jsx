import { useNavigate } from "react-router-dom";
import { Link as LinkIcon, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: "2rem",
      position: "relative",
      overflow: "hidden",
      fontFamily: "Plus Jakarta Sans, sans-serif",
    }}>
      {/* Ambient blobs */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      {/* Card */}
      <div className="card" style={{
        maxWidth: 440, width: "100%",
        padding: "3rem 2rem",
        textAlign: "center",
        position: "relative",
        zIndex: 2,
        borderColor: "rgba(99,102,241,0.2)",
      }}>
        {/* Logo mark */}
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 48, height: 48, borderRadius: 12,
          background: "var(--accent-glow)",
          border: "1px solid rgba(99,102,241,0.3)",
          marginBottom: "1.5rem",
        }}>
          <LinkIcon style={{ width: 22, height: 22, color: "var(--accent-light)" }} />
        </div>

        {/* 404 number */}
        <div style={{
          fontSize: "5rem",
          fontWeight: 800,
          letterSpacing: "-0.05em",
          lineHeight: 1,
          marginBottom: "0.75rem",
          background: "linear-gradient(135deg, #6d70ff 0%, #4f46e5 60%, #a5b4fc 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          404
        </div>

        <h1 style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          margin: "0 0 0.625rem",
          letterSpacing: "-0.02em",
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: "0.875rem",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          margin: "0 0 2rem",
          maxWidth: 320,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost"
            style={{ padding: "0.625rem 1.25rem", fontSize: "0.875rem" }}
          >
            <ArrowLeft style={{ width: 15, height: 15 }} />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn-primary"
            style={{ padding: "0.625rem 1.25rem", fontSize: "0.875rem" }}
          >
            <Home style={{ width: 15, height: 15 }} />
            Home
          </button>
        </div>
      </div>

      <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "var(--text-muted)", position: "relative", zIndex: 2 }}>
        via <span style={{ color: "var(--accent-light)", fontWeight: 600 }}>Linkly</span> · Smart URL Platform
      </p>
    </div>
  );
};

export default NotFound;