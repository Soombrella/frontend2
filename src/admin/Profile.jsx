// src/admin/Profile.jsx

import React, { useState } from "react";
import "./Profile.css";
import Modal from "../components/Modal"; // Modal.jsx 경로에 맞게 조정
import AdminBottomTab from "./AdminBottomTab";

import { useAuth } from "../auth/AuthContext"; // AuthContext 사용 가정

export default function Profile() {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout(); // AuthContext에 정의된 로그아웃 함수
    alert("로그아웃되었습니다.");
    window.location.href = "/login";
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="back-btn" onClick={() => window.history.back()} aria-label="뒤로가기">
          ←
        </button>
        <h1>SoomBrella</h1>
      </header>

      <main className="profile-content">
        <div className="profile-user">
          <div className="profile-avatar">
            <span role="img" aria-label="관리자">
              👤
            </span>
          </div>
          <p className="profile-name">{user?.name || "관리자"}</p>
        </div>

        <button className="btn-guide" onClick={() => setOpen(true)}>
          SoomBrella 사용법
        </button>

        <button className="btn-logout" onClick={handleLogout}>
          로그아웃
        </button>
      </main>

      {/* 모달창 */}
      <Modal open={open} onClose={() => setOpen(false)} title="SoomBrella 사용법">
        <div className="guide-content">
          <p>1️⃣ 학생 대여 상태 관리에서 학생별 대여 현황을 확인하고 상태를 수정할 수 있습니다.</p>
          <p>2️⃣ 재고 관리 페이지에서 우산/보조배터리의 상태를 관리할 수 있습니다.</p>
          <p>3️⃣ 연체 상태에서는 툴팁을 통해 연체일을 확인할 수 있습니다.</p>
          <p>4️⃣ 모든 변경 사항은 추후 서버와 연동되어 자동 저장될 예정입니다.</p>
        </div>
      </Modal>

      <AdminBottomTab />

    </div>
  );
}