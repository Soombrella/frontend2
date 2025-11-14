// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { username, name, email, dept, password? }
  const [token, setToken] = useState(null); // 문자열

  // 앱 처음 켤 때 localStorage에서 로그인 정보 복원
  useEffect(() => {
    const rawUser = localStorage.getItem("sb_user");
    const rawToken = localStorage.getItem("sb_token");
    if (rawUser && rawToken) {
      try {
        setUser(JSON.parse(rawUser));
        setToken(rawToken);
      } catch {
        // 파싱 실패하면 싹 비움
        localStorage.removeItem("sb_user");
        localStorage.removeItem("sb_token");
      }
    }
  }, []);

  // 로그인
  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("sb_token", token);
    localStorage.setItem("sb_user", JSON.stringify(user));
  };

  // 로그아웃
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("sb_token");
    localStorage.removeItem("sb_user");
  };

  // ✏️ 프로필 수정: email, dept 등 일부만 패치
  const updateUser = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };

      // 현재 로그인 사용자 정보 갱신
      localStorage.setItem("sb_user", JSON.stringify(next));

      // 회원 목록(sb_users)에도 반영
      const listRaw = localStorage.getItem("sb_users");
      if (listRaw && prev.username) {
        try {
          const list = JSON.parse(listRaw).map((u) =>
            u.username === prev.username ? { ...u, ...patch } : u
          );
          localStorage.setItem("sb_users", JSON.stringify(list));
        } catch {
          // 목록이 깨져 있으면 그냥 무시
        }
      }

      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}