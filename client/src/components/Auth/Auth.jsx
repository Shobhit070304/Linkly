import React, { useContext } from "react";
import { auth, googleProvider, githubProvider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { AuthContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, LogOut } from "lucide-react";
import { toast } from "react-toastify";

const Auth = () => {
  const { user, login, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      const userData = await signInWithPopup(auth, googleProvider);
      login(userData.user);
      navigate("/dashboard");
      toast.success("Welcome back");
    } catch {
      toast.error("Google login failed");
    }
  };

  const loginWithGithub = async () => {
    try {
      const userData = await signInWithPopup(auth, githubProvider);
      login(userData.user);
      navigate("/dashboard");
      toast.success("Welcome back");
    } catch {
      toast.error("GitHub login failed");
    }
  };

  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}&backgroundColor=17171c&textColor=f0f0f2`;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <Loader2 style={{ width: 22, height: 22, animation: "spin 1s linear infinite", color: "var(--text-primary)" }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: "1rem", position: "relative", fontFamily: "Inter, sans-serif" }}>
      
      <Link
        to={user ? "/dashboard" : "/"}
        style={{ position: "absolute", top: "1.5rem", left: "1.5rem", fontSize: "0.8125rem", color: "var(--text-secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.375rem" }}
      >
        <ArrowLeft style={{ width: 14, height: 14 }} />
        Back
      </Link>

      <div style={{ width: "100%", maxWidth: 360 }}>
        <div className="card" style={{ padding: "2rem 1.5rem" }}>
          {!user ? (
            <>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text-primary)", margin: "0 0 0.25rem" }}>
                  Log in to Linkly
                </h2>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0 }}>
                  Sign in to access your dashboard and links.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <button
                  onClick={loginWithGoogle}
                  className="btn-ghost"
                  style={{ width: "100%", justifyContent: "center", padding: "0.5625rem 1rem", fontSize: "0.8125rem", borderRadius: "8px" }}
                >
                  <svg style={{ width: 14, height: 14 }} viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                    <path d="M533.5 278.4c0-17.4-1.5-34.1-4.4-50.3H272v95.1h146.9c-6.4 34.4-25.6 63.6-54.6 83.1v68h88c51.4-47.3 81.2-117.1 81.2-195.9z" fill="#4285F4" />
                    <path d="M272 544.3c73.7 0 135.6-24.5 180.8-66.5l-88-68c-24.5 16.4-55.8 26-92.8 26-71 0-131.1-47.9-152.7-112.1H29v70.4c45.3 89.3 137.6 150.2 243 150.2z" fill="#34A853" />
                    <path d="M119.3 323.7c-10.8-32.3-10.8-67.1 0-99.4V154h-90.4C4.1 191.6-8.7 233.2 0 274.3c8.7 41.1 29.8 78.3 58.9 105.5l90.4-56.1z" fill="#FBBC05" />
                    <path d="M272 107.7c39.9 0 75.8 13.7 104.2 40.7l78-78C415.6 26.3 353.7 0 272 0 166.6 0 74.3 60.9 29 150.2l90.4 69.4c21.6-64.2 81.7-111.9 152.6-111.9z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={loginWithGithub}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "0.5625rem 1rem", fontSize: "0.8125rem", borderRadius: "8px" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" style={{ width: 14, height: 14 }} viewBox="0 0 24 24">
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.3c-3.2.7-3.9-1.5-3.9-1.5-.5-1.1-1.2-1.4-1.2-1.4-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.7-.9 2.3-1.3.1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.2 0 4.6-2.7 5.6-5.3 5.9.4.3.8 1 .8 2v3c0 .3.2.7.8.6a10.6 10.6 0 0 0 7.9-10.8C23.5 5.65 18.35.5 12 .5z" />
                  </svg>
                  Continue with GitHub
                </button>
              </div>

              <p style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.6875rem", color: "var(--text-muted)", margin: "1.25rem 0 0" }}>
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <img
                src={avatar}
                alt="User"
                style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 0.75rem", border: "1px solid var(--border-strong)" }}
              />
              <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 0.125rem" }}>
                {user.name}
              </h2>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>{user.email}</p>

              <button
                onClick={logout}
                className="btn-ghost"
                style={{ width: "100%", justifyContent: "center", padding: "0.5625rem 1rem", fontSize: "0.8125rem", borderRadius: "8px" }}
              >
                <LogOut style={{ width: 14, height: 14 }} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
