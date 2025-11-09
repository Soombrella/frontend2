// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user'); // ← 추가
    if (!t) { setLoading(false); return; }

    // 1) 로컬 저장된 유저가 있으면 우선 복구 (백엔드 없어도 됨)
    if (savedUser) {
      try {
        setToken(t);
        setUser(JSON.parse(savedUser));
        setLoading(false);
        return;
      } catch {
        // 파싱 실패 시 아래로 넘어가서 서버 검증 시도
      }
    }

    // 2) 서버 검증(백엔드 붙인 뒤에 동작), 지금은 실패해도 OK
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${t}` }});
        if (!res.ok) throw new Error('unauthorized');
        const me = await res.json();
        setToken(t);
        setUser(me);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = (t, me) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(me)); // ← 추가
    setToken(t);
    setUser(me);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // ← 추가
    setToken(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
