import { useNavigate, Link } from "react-router-dom";
import "./findpw.css";
import { useState } from "react";
import { findPwRequestApi } from "../api/auth";

export default function FindPwRequest() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(sessionStorage.getItem("findpw_email") || "");
  const [loading, setLoading] = useState(false);

  const goVerify = () => {
    const v = email.trim();
    if (!v) {
      alert("이메일을 입력해주세요.");
      return;
    }
    sessionStorage.setItem("findpw_email", v);
    navigate("/findpw/verify", { state: { email: v } });
  };

  const handleRequest = async () => {
    const v = email.trim();
    if (!v) return;

    setLoading(true);
    try {
      await findPwRequestApi(v);
      sessionStorage.setItem("findpw_email", v);
      alert("인증번호가 이메일로 전송되었습니다.");
      navigate("/findpw/verify", { state: { email: v } });
    } catch (e) {
      alert(e?.message || "인증번호 요청 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="FindPwWrap">
      <div className="FindPwCard">
        <div className="FindPwHeader">
          <button className="BackBtn" onClick={() => navigate(-1)} aria-label="뒤로가기">
            ←
          </button>
          <h2 className="FindPwTitle">비밀번호 찾기</h2>
        </div>

        <div className="FindPwForm">
          <label className="Label">이메일</label>
          <input
            className="Input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@sookmyung.ac.kr"
            type="email"
          />

          <button
            className="PrimaryBtn"
            type="button"
            onClick={handleRequest}
            disabled={loading || !email.trim()}
          >
            {loading ? "전송 중..." : "인증번호 받기"}
          </button>

          <p className="Helper">
            인증번호를 받은 뒤{" "}
            <button type="button" className="InlineLinkBtn" onClick={goVerify}>
              인증번호 확인
            </button>
            에서 입력해주세요.
          </p>

          {/* 혹시 버튼형 링크 싫으면 아래처럼 Link로도 가능
          <p className="Helper">
            인증번호를 받은 뒤 <Link className="InlineLink" to="/findpw/verify" state={{ email: email.trim() }}>인증번호 확인</Link>에서 입력해주세요.
          </p>
          */}
        </div>
      </div>
    </div>
  );
}