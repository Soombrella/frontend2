// src/login/login.jsx
import './login.css';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ 개발용 빠른 로그인 (백엔드 없이 마이페이지 들어가기)
  const devLogin = () => {
    const fakeUser = {
      name: '방지영',
      username: '2412801', // 아이디 = 학번
      email: 'test@sookmyung.ac.kr',
      dept: '소프트웨어학부 컴퓨터과학전공',
      birth: '2004-04-28',
    };
    login('dev-token', fakeUser); // AuthContext로 로그인 처리
    const redirectTo = location.state?.from?.pathname || '/';
    navigate(redirectTo, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ⚠️ 실제 백엔드 붙이기 전엔 주석 처리하고 devLogin만 써도 됨
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError('아이디 또는 비밀번호를 확인해주세요.');
        setLoading(false);
        return;
      }

      const data = await res.json(); // { token, user }
      login(data.token, data.user);

      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="LoginWrap">
      <button
        className="BackBtn"
        onClick={() => navigate(-1)}
        aria-label="뒤로가기"
      >
        ←
      </button>

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
        />
        <input
          className="Input"
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="Remember">
          <input type="checkbox" /> 아이디 기억하기
        </label>

        <button className="PrimaryBtn" type="submit" disabled={loading}>
          {loading ? '로그인 중…' : '로그인'}
        </button>

        {error && <p className="ErrorMsg">{error}</p>}
      </form>

      {/* ⬇️ 개발 중에만 쓰는 빠른 로그인 버튼 */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <button type="button" onClick={devLogin} className="PrimaryBtn" style={{ opacity: 0.9 }}>
            개발용 빠른 로그인
          </button>
        </div>
      )}

      <div className="Links">
        <Link to="/signup">회원가입하기</Link> | <Link to="#">비밀번호 찾기</Link>
      </div>
    </main>
  );
}
