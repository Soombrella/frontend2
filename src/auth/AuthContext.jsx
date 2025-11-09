import { createContext, useContext, useEffect, useState } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const cachedUser = localStorage.getItem('user'); // 로컬 복구용
    if (!t) { setLoading(false); return; }

    // 1) 백엔드 없어도: 로컬에 저장된 user로 즉시 복구
    if (cachedUser) {
      try {
        setToken(t);
        setUser(JSON.parse(cachedUser));
        setLoading(false);
        return; // 여기서 끝냄 → 서버 검증 안 함
      } catch {
        // 파싱 실패 시 서버 검증 시도
      }
    }

    // 2) 백엔드가 있을 때: 토큰으로 me 검증
    (async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${t}` },
        });
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
    localStorage.setItem('user', JSON.stringify(me)); // 로컬에도 저장
    setToken(t);
    setUser(me);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
