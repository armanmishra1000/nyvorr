// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("nyvorr_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("nyvorr_token"));
  const [loading, setLoading] = useState(false);

  // Login: fetch and save user & token
  const login = async (email, password) => {
    setLoading(true);
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) throw new Error(data.error || "Login failed");
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("nyvorr_user", JSON.stringify(data.user));
    localStorage.setItem("nyvorr_token", data.token);
    return data.user;
  };

  // Logout: Remove user & token
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("nyvorr_user");
    localStorage.removeItem("nyvorr_token");
  };

  // Auto-load user from localStorage on mount (if needed)
  useEffect(() => {
    if (!user && localStorage.getItem("nyvorr_user")) {
      setUser(JSON.parse(localStorage.getItem("nyvorr_user")));
      setToken(localStorage.getItem("nyvorr_token"));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context easily
export function useAuth() {
  return useContext(AuthContext);
}