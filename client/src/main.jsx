import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserContext from "./context/UserContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { Component } from "react";

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#111115" }}>
          <div style={{ background: "#17171c", border: "1px solid rgba(255,255,255,0.07)", padding: "2rem", borderRadius: "12px", maxWidth: "420px", width: "100%", textAlign: "center" }}>
            <h2 style={{ color: "#f0f0f2", marginBottom: "0.75rem", fontSize: "1.125rem", fontWeight: 600 }}>Something went wrong</h2>
            <p style={{ color: "#8b8b99", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
              An error occurred while loading this page. Please try refreshing.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ background: "#f0f0f2", color: "#111115", padding: "0.5rem 1.25rem", borderRadius: "8px", fontWeight: 500, fontSize: "0.875rem", cursor: "pointer", border: "none" }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);
root.render(
  process.env.NODE_ENV === "development" ? (
    <StrictMode>
      <BrowserRouter>
        <ErrorBoundary>
          <UserContext>
            <App />
          </UserContext>
        </ErrorBoundary>
      </BrowserRouter>
    </StrictMode>
  ) : (
    <BrowserRouter>
      <ErrorBoundary>
        <UserContext>
          <App />
        </UserContext>
      </ErrorBoundary>
    </BrowserRouter>
  )
);
