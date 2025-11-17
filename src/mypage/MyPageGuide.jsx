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

  // 🔐 탈퇴 모달 상태 (UI만, 실제 탈퇴 X)
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [doing, setDoing] = useState(false);

  const open = (title) => setModal({ open: true, title });
  const close = () => setModal({ open: false, title: "" });

  const v = (x) => x || "";

  // ✅ 현재는 “디자인/흐름 확인용”으로만 동작
  //    실제 탈퇴 로직은 백엔드 연동 시 구현 예정
  const onConfirmWithdraw = () => {
    setPwErr(
      "현재 테스트 버전에서는 실제 탈퇴가 처리되지 않습니다.\n" +
      "서비스 정식 오픈 후 백엔드 연동 시 계정 삭제가 가능해집니다."
    );
    // doing 플래그는 사용 안 함 (혹시 나중에 로딩 표시 추가하고 싶으면 사용)
  };

  return (
    <main className="MyPageWrap">
      {/* 헤더 */}
      <header className="MPHeader">
        <button
          className="BackBtn"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          ←
        </button>
        <Link to="/" className="MPTitle MPBrandLink">
          SoomBrella
        </Link>
        <div style={{ width: 24 }} />
      </header>

      {/* 프로필 요약 */}
      <section className="ProfileCard">
        <div className="Avatar" aria-hidden>
          👤
        </div>
        <div className="Who">
          <div className="Nick">
            {v(user?.name)}
            {user?.username ? ` (${user.username})` : ""}
          </div>
          <div className="Meta">{v(user?.dept)}</div>
        </div>
      </section>

      {/* 탭 */}
      <nav className="Tabs">
        <button className="Tab" onClick={() => navigate("/mypage")}>
          계정 정보
        </button>
        <button className="Tab" onClick={() => navigate("/mypage/rents")}>
          대여 목록
        </button>
        <button className="Tab active">이용 안내</button>
      </nav>

      {/* 안내 리스트 */}
      <section className="Card gap-10">
        <button
          className="ListBtn"
          onClick={() => open("반납 관련 안내사항")}
        >
          반납 관련 안내사항
        </button>
        <button
          className="ListBtn"
          onClick={() => open("개인정보 처리방침")}
        >
          개인정보 처리방침
        </button>
        <button
          className="ListBtn"
          onClick={() => open("서비스 이용 약관")}
        >
          서비스 이용 약관
        </button>
      </section>

      {/* 안내 모달 (내용은 추후 채우기) */}
      <SimpleModal open={modal.open} title={modal.title} onClose={close}>
        <p style={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
          추후 추가 예정
        </p>
      </SimpleModal>

      {/* 하단 액션 */}
      <div className="Actions">
        {/* 로그아웃은 실제 동작 */}
        <button
          className="Btn ghost"
          onClick={() => {
            try {
              logout && logout();
            } catch {}
            navigate("/");
          }}
        >
          로그아웃
        </button>

        {/* 회원탈퇴: 지금은 화면/플로우만 구현 */}
        <button
          className="Btn primary"
          onClick={() => {
            setPw("");
            setPwErr("");
            setWithdrawOpen(true);
          }}
        >
          회원탈퇴
        </button>
      </div>

      {/* 🔐 탈퇴 확인 + 비밀번호 입력 모달 (현재는 안내만) */}
      <SimpleModal
        open={withdrawOpen}
        title="탈퇴 하시겠습니까?"
        onClose={() => {
          if (!doing) setWithdrawOpen(false);
        }}
        onConfirm={onConfirmWithdraw}
        confirmText={doing ? "처리중..." : "확인"}
        disabled={doing}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <label className="Label" htmlFor="pw">
            비밀번호 확인
          </label>
          <input
            id="pw"
            type="password"
            className="Input"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="현재 비밀번호 (테스트용)"
            autoComplete="current-password"
            disabled={doing}
          />
          {pwErr && (
            <small style={{ color: "#b91c1c", whiteSpace: "pre-line" }}>
              {pwErr}
            </small>
          )}
          <p className="Note" style={{ marginTop: 6, color: "#6b7280" }}>
            현재 버전에서는 실제 계정 삭제는 되지 않으며,
            <br />
            정식 서비스 오픈 후 백엔드 연동 시 탈퇴 기능이 활성화됩니다.
          </p>
        </div>
      </SimpleModal>

      <BottomTab />
    </main>
  );
}