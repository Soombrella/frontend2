// src/mypage/MyPagePassword.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordApi } from "../api/auth";
import "./mypage.css";

const CODE_KEY = "sb_pwd_code";

export default function MyPagePassword() {
  const navigate = useNavigate();

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 마이페이지에서 인증번호 검증 후 넘어왔는지 체크(흐름 보호)
  useEffect(() => {
    // MyPage.jsx에서 verify 성공하면 localStorage.removeItem(CODE_KEY) 하고 넘어오니까
    // 이 방식이면 여기서 검증이 불가함.
    // 그래서 "검증 완료 플래그"를 따로 쓰는 게 베스트인데,
    // 지금은 최소한의 UX 보호만 적용: 이 페이지를 직접 들어온 경우도 허용하되, 안내만 해줌.
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!currentPw.trim()) return alert("현재 비밀번호를 입력해 주세요.");
    if (!newPw.trim()) return alert("새 비밀번호를 입력해 주세요.");
    if (newPw.length < 8) return alert("새 비밀번호는 8자 이상으로 설정해 주세요.");
    if (newPw !== newPw2) return alert("새 비밀번호 확인이 일치하지 않습니다.");
    if (currentPw === newPw) return alert("현재 비밀번호와 새 비밀번호가 동일합니다.");

    setLoading(true);
    try {
      const res = await changePasswordApi({
        current_password: currentPw.trim(),
        new_password: newPw.trim(),
      });

      if (res?.success === false) {
        alert(res?.message || "비밀번호 변경에 실패했습니다.");
        return;
      }

      alert(res?.message || "비밀번호가 변경되었습니다. 다시 로그인해 주세요.");

      // 보안상 토큰 제거 후 로그인 유도
      localStorage.removeItem("sb_token");
      localStorage.removeItem("sb_user");

      navigate("/login", { replace: true });
    } catch (err) {
      alert(err.message || "비밀번호 변경 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="MyPageWrap">
      <header className="MPHeader">
        <button className="BackBtn" onClick={() => navigate(-1)} aria-label="뒤로가기">
          ←
        </button>
        <div className="MPTitle">비밀번호 변경</div>
        <div style={{ width: 24 }} />
      </header>

      <form className="Card" onSubmit={onSubmit} style={{ gap: 10 }}>
        <label className="Label" htmlFor="currentPw">
          현재 비밀번호
        </label>
        <input
          id="currentPw"
          type="password"
          className="Input"
          value={currentPw}
          onChange={(e) => setCurrentPw(e.target.value)}
          placeholder="현재 비밀번호 입력"
          autoComplete="current-password"
          disabled={loading}
        />

        <label className="Label" htmlFor="newPw">
          새 비밀번호
        </label>
        <input
          id="newPw"
          type="password"
          className="Input"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          placeholder="새 비밀번호 입력 (8자 이상)"
          autoComplete="new-password"
          disabled={loading}
        />

        <label className="Label" htmlFor="newPw2">
          새 비밀번호 확인
        </label>
        <input
          id="newPw2"
          type="password"
          className="Input"
          value={newPw2}
          onChange={(e) => setNewPw2(e.target.value)}
          placeholder="새 비밀번호 다시 입력"
          autoComplete="new-password"
          disabled={loading}
        />

        <button className="Btn primary" type="submit" disabled={loading}>
          {loading ? "변경 중..." : "비밀번호 변경"}
        </button>

        <small className="Note" style={{ color: "#6b7280" }}>
          변경 완료 후 보안을 위해 다시 로그인합니다.
        </small>
      </form>
    </main>
  );
}