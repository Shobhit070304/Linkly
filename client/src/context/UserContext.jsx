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
    console.log("User data received:", userData);
    const userInfo = {
      name: userData.displayName,
      email: userData.email,
    };
    localStorage.setItem("user", JSON.stringify(userInfo));
    localStorage.setItem("token", userData.accessToken);
    setUser(userInfo);
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, {
      name: userData.displayName,
      email: userData.email,
    },
      {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
        },
      }
    );
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
