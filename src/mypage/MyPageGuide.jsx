// src/mypage/MyPageGuide.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SimpleModal from "../components/SimpleModal";
import "./mypage.css";
import BottomTab from "../components/BottomTab";
import "../components/BottomTab.css";
import { useAuth } from "../auth/AuthContext";

export default function MyPageGuide() {
  const navigate = useNavigate();
  const { user, logout } = useAuth() ?? {};
  const [modal, setModal] = useState({ open: false, title: "" });

  // 🔐 탈퇴 모달 상태
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [doing, setDoing] = useState(false);

  const open = (title) => setModal({ open: true, title });
  const close = () => setModal({ open: false, title: "" });
  const v = (x) => x || "";

  // --- 모의 비번 검증 (백엔드 없는 상태) ---
  // 저장 위치 예시:
  //  - 'sb_auth_pw' 키에 평문 저장되어 있다고 가정
  //  - 없으면 user?.password 사용 시도
  //  - 둘 다 없으면 데모 환경으로 간주하여 항상 실패 처리(원하면 true로 바꿔 테스트 가능)
  const validatePassword = (input) => {
    const stored =
      localStorage.getItem("sb_auth_pw") ||
      (user && user.password) || // 혹시 컨텍스트에 있다면
      null;

    if (!stored) {
      // 데모 환경에서 임시 통과를 원하면 아래 주석 해제
      // return input.length > 0;
      return false; // 기본은 검증 실패로 처리
    }
    return String(input) === String(stored);
  };

  // --- 모의 DB 삭제 ---
  const mockDeleteUser = () => {
    try {
      // 예시) 사용자 목록에서 제거
      const listRaw = localStorage.getItem("sb_users");
      if (listRaw && user?.username) {
        const arr = JSON.parse(listRaw).filter((u) => u.username !== user.username);
        localStorage.setItem("sb_users", JSON.stringify(arr));
      }
      // 예시) 현재 세션/토큰/프로필 제거
      localStorage.removeItem("sb_auth_pw");
      localStorage.removeItem("sb_token");
      localStorage.removeItem("sb_user");   // 프로젝트에서 쓰는 키명에 맞춰 추가/수정
      // 사용자 대여 기록을 사용자별로 저장한다면 키를 분리해 제거
      // localStorage.removeItem(`sb_rents_${user?.username}`);
    } catch (e) {
      // 로컬 삭제이므로 조용히 무시
      console.error(e);
    }
  };

  const onConfirmWithdraw = async () => {
    setPwErr("");
    if (!pw) { setPwErr("비밀번호를 입력하세요."); return; }
    setDoing(true);

    const ok = validatePassword(pw);
    if (!ok) {
      setDoing(false);
      setPwErr("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 모의 DB 삭제 → 로그아웃 → 메인 이동
    mockDeleteUser();
    try { logout && logout(); } catch {}
    setDoing(false);
    setWithdrawOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <main className="MyPageWrap">
      {/* 헤더 */}
      <header className="MPHeader">
        <button className="BackBtn" onClick={() => navigate(-1)} aria-label="뒤로가기">←</button>
        <Link to="/" className="MPTitle MPBrandLink">SoomBrella</Link>
        <div style={{ width: 24 }} />
      </header>

      {/* 프로필 요약 */}
      <section className="ProfileCard">
        <div className="Avatar" aria-hidden>👤</div>
        <div className="Who">
          <div className="Nick">{v(user?.name)}{user?.username ? ` (${user.username})` : ""}</div>
          <div className="Meta">{v(user?.dept)}</div>
        </div>
      </section>

      {/* 탭 */}
      <nav className="Tabs">
        <button className="Tab" onClick={() => navigate("/mypage")}>계정 정보</button>
        <button className="Tab" onClick={() => navigate("/mypage/rents")}>대여 목록</button>
        <button className="Tab active">이용 안내</button>
      </nav>

      {/* 안내 리스트 */}
      <section className="Card gap-10">
        <button className="ListBtn" onClick={() => open("반납 관련 안내사항")}>반납 관련 안내사항</button>
        <button className="ListBtn" onClick={() => open("개인정보 처리방침")}>개인정보 처리방침</button>
        <button className="ListBtn" onClick={() => open("서비스 이용 약관")}>서비스 이용 약관</button>
      </section>

      {/* 안내 모달 */}
      <SimpleModal open={modal.open} title={modal.title} onClose={close}>
        <p style={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>추후 추가 예정</p>
      </SimpleModal>

      {/* 하단 액션 */}
      <div className="Actions">
        <button
          className="Btn ghost"
          onClick={() => { try { logout(); } catch {} navigate("/"); }}
        >
          로그아웃
        </button>

        <button
          className="Btn primary"
          onClick={() => { setPw(""); setPwErr(""); setWithdrawOpen(true); }}
        >
          회원탈퇴
        </button>
      </div>

      {/* 🔐 탈퇴 확인 + 비밀번호 입력 모달 */}
      <SimpleModal
        open={withdrawOpen}
        title="탈퇴 하시겠습니까?"
        onClose={() => { if (!doing) setWithdrawOpen(false); }}
        onConfirm={onConfirmWithdraw}
        confirmText={doing ? "처리중..." : "탈퇴"}
        disabled={doing}
      >
        <div style={{ display:"grid", gap:8 }}>
          <label className="Label" htmlFor="pw">비밀번호 확인</label>
          <input
            id="pw"
            type="password"
            className="Input"
            value={pw}
            onChange={(e)=>setPw(e.target.value)}
            placeholder="현재 비밀번호"
            autoComplete="current-password"
            disabled={doing}
          />
          {pwErr && <small style={{ color:"#b91c1c" }}>{pwErr}</small>}
          <p className="Note" style={{ marginTop:6 }}>
            탈퇴 시 계정 및 관련 데이터가 삭제되며 복구할 수 없습니다.
          </p>
        </div>
      </SimpleModal>

      <BottomTab />
    </main>
  );
}
