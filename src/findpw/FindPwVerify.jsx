import { useLocation, useNavigate } from "react-router-dom";
import "./findpw.css";
import { useEffect, useMemo, useState } from "react";
import { findPwVerifyApi } from "../api/auth";

export default function FindPwVerify() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = useMemo(() => {
    return location.state?.email || sessionStorage.getItem("findpw_email") || "";
  }, [location.state]);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) navigate("/findpw", { replace: true });
  }, [email, navigate]);

  const handleVerify = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      await findPwVerifyApi(email, code.trim());
      alert("임시 비밀번호를 이메일로 발송했습니다. 로그인 해주세요.");
      navigate("/login", { replace: true });
    } catch (e) {
      alert(e?.message || "인증번호 확인 실패");
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
          <h2 className="FindPwTitle">인증번호 확인</h2>
        </div>

        <div className="FindPwForm">
          <div className="ReadOnlyRow">
            <span className="ReadOnlyLabel">이메일</span>
            <span className="ReadOnlyValue">{email}</span>
          </div>

          <label className="Label">인증번호</label>
          <input
            className="Input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="이메일로 받은 인증번호"
          />

          <button
            className="PrimaryBtn"
            type="button"
            onClick={handleVerify}
            disabled={loading || !code.trim()}
          >
            {loading ? "확인 중..." : "확인하기"}
          </button>
        </div>
      </div>
    </div>
  );
}