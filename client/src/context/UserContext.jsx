import { createContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Keep a stable ref so the interceptor can always call the latest logout
  const logoutRef = useRef(null);

  const logout = () => {
    navigate("/");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // Keep ref in sync
  logoutRef.current = logout;

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);

    // Auto-logout when token is expired (401) or user is deleted from DB (404)
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const errMsg = error.response?.data?.error || "";
        if (
          status === 404 && errMsg === "User not found" ||
          status === 401 && errMsg.includes("invalid token")
        ) {
          toast.warn("Session expired. Please sign in again.");
          logoutRef.current?.();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, []);

  const login = async (userData) => {
    try {
      if (!userData) {
        console.error("Login failed: No user data provided");
        return;
      }
      
      const userInfo = {
        name: userData.displayName || "User",
        email: userData.email || "",
      };
      
      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("token", userData.accessToken || "");
      setUser(userInfo);
      
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/login`,
          {}, // Server reads from req.user (Firebase token), body is not used
          {
            headers: {
              Authorization: `Bearer ${userData.accessToken || ""}`,
            },
          }
        );
      } catch (apiError) {
        console.error("API login error:", apiError);
        // Still keep the user logged in on the client side even if the API call fails
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default UserContext;
