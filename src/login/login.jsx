import './login.css';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  return (
    <main className="LoginWrap">
      <button
        className="BackBtn"
        onClick={() => navigate(-1)}   // ← history.back() 대신
        aria-label="뒤로가기"
      >
        ←
      </button>

      <section className="LoginHero">
        <h1 className="Brand">SoomBrella</h1>
        <p className="Sub">
          숙명인을 위한 대여 사이트<br/>숨브렐라에 오신 것을 환영합니다!
        </p>
      </section>

      <form className="LoginForm" onSubmit={(e)=>e.preventDefault()}>
        <input className="Input" placeholder="아이디" />
        <input className="Input" placeholder="비밀번호" type="password" />
        <label className="Remember">
          <input type="checkbox" /> 아이디 기억하기
        </label>
        <button className="PrimaryBtn" type="submit">로그인</button>
      </form>

      <div className="Links">
        <Link to="/signup">회원가입하기</Link> | <Link to="#">아이디찾기</Link> | <Link to="#">비밀번호 찾기</Link>
      </div>
    </main>
  );
}