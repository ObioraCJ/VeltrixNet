import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On page load, restore the session if a token exists
  useEffect(() => {
    const token = localStorage.getItem("veltrix_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/users/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("veltrix_token"))
      .finally(() => setLoading(false));
  }, []);

  const saveSession = (data) => {
    localStorage.setItem("veltrix_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return saveSession(res.data);
  };

  const signup = async (form) => {
    const res = await api.post("/auth/signup", form);
    return saveSession(res.data);
  };

  const logout = () => {
    localStorage.removeItem("veltrix_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);