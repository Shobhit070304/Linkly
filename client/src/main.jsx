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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-700 mb-4">
              We're sorry, but there was an error loading this page. Please try refreshing or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
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

// Performance optimization: Only use StrictMode in development
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);
root.render(
  process.env.NODE_ENV === 'development' ? (
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
