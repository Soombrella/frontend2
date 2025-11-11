import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleModal from "../components/SimpleModal";
import "./mypage.css";
import { useAuth } from "../auth/AuthContext";
import { Link } from 'react-router-dom';


export default function MyPageGuide() {
  const navigate = useNavigate();
  const { user, logout } = useAuth() ?? {};
  const [modal, setModal] = useState({ open: false, title: "" });

  const open = (title) => setModal({ open: true, title });
  const close = () => setModal({ open: false, title: "" });

  const v = (x) => x || "";

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

      {/* 모달 */}
      <SimpleModal open={modal.open} title={modal.title} onClose={close}>
        <p style={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>추후 추가 예정</p>
      </SimpleModal>

      {/* 하단 액션 (선택) */}
      <div className="Actions">
        <button
            className="Btn ghost"
            onClick={() => { logout(); navigate("/"); }}
        >
        로그아웃
        </button>
        <button className="Btn primary" onClick={() => alert("준비 중입니다")}>
        회원탈퇴
        </button>
      </div>
    </main>
  );
}
