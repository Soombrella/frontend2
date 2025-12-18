// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getMyInfoApi } from "../api/mypage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⭐ 핵심

  // 새로고침 시 토큰으로 사용자 복구
  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem("sb_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await getMyInfoApi();
        setUser(me);
      } catch (e) {
        console.error("유저 복구 실패", e);
        localStorage.removeItem("sb_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("sb_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("sb_token");
    setUser(null);
  };

  const updateUser = (next) => {
    setUser((prev) => ({ ...prev, ...next }));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}