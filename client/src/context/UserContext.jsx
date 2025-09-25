import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false); // Done loading
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
          {
            name: userInfo.name,
            email: userInfo.email,
          },
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

  const logout = () => {
    navigate("/");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default UserContext;
