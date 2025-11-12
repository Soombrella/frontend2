// src/login/login.jsx
import './login.css';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useEffect, useState } from 'react';
import { loginLocal } from '../lib/fakeAuth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth() ?? {};

  const [username, setUsername] = useState('');
  const [remember, setRemember] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // 페이지 진입 시 저장된 아이디 복원
  useEffect(() => {
    const saved = localStorage.getItem('sb_remember_id');
    if (saved) {
      setUsername(saved);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 백엔드 없는 로컬 로그인
      const { token, user } = await loginLocal(username, password);
      login?.(token, user);

      // 아이디 기억하기 저장/해제
      if (remember) localStorage.setItem('sb_remember_id', username);
      else localStorage.removeItem('sb_remember_id');

      // 돌아갈 경로 (보호 라우트에서 왔을 때)
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err?.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="LoginWrap">
      <button className="BackBtn" onClick={() => navigate(-1)} aria-label="뒤로가기">←</button>

      <section className="LoginHero">
        <h1 className="Brand">SoomBrella</h1>
        <p className="Sub">
          숙명인을 위한 대여 사이트<br />숨브렐라에 오신 것을 환영합니다!
        </p>
      </section>

      <form className="LoginForm" onSubmit={handleSubmit}>
        <input
          className="Input"
          placeholder="아이디 (학번)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          inputMode="text"
        />
        <input
          className="Input"
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <label className="Remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />{' '}
          아이디 기억하기
        </label>

        <button className="PrimaryBtn" type="submit" disabled={loading}>
          {loading ? '로그인 중…' : '로그인'}
        </button>

        {error && <p className="ErrorMsg">{error}</p>}
      </form>

      <div className="Links">
        <Link to="/signup">회원가입하기</Link> | <Link to="#">비밀번호 찾기</Link>
      </div>
    </main>
  );
}
