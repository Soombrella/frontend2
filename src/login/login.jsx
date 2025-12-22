// src/login/login.jsx
import "./login.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import { loginApi } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [username, setUsername] = useState(""); // 학번 입력
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ 백엔드 로그인
      const { token, user } = await loginApi(username, password);

      // ✅ AuthContext에 로그인 상태 저장
      login(token, user);

      // ✅ 관리자면 무조건 /admin으로 이동
      if (user?.is_admin) {
        navigate("/admin", { replace: true });
        return;
      }

      // ✅ 일반 사용자는 원래 로직(이전 페이지로 돌아가거나 /)
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "로그인 중 오류가 발생했습니다.");
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
          숙명인을 위한 대여 사이트
          <br />
          숨브렐라에 오신 것을 환영합니다!
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
          {loading ? "로그인 중…" : "로그인"}
        </button>

        {error && <p className="ErrorMsg">{error}</p>}
      </form>

      <div className="Links">
        <Link to="/signup">회원가입하기</Link> |{" "}
        <Link to="/findpw">비밀번호 찾기</Link>
      </div>
    </main>
  );
}