import { NavLink } from "react-router-dom";
import "./BottomTab.css";

export default function BottomTab() {
  return (
    <nav className="bottom-tab">
      <NavLink to="/" className={({ isActive }) => "tab-item" + (isActive ? " active" : "")}>
        {/* 홈 아이콘 (SVG) */}
        <svg viewBox="0 0 24 24" className="tab-icon" aria-hidden="true">
          <path d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5v-9z" fill="currentColor"/>
        </svg>
        <span className="tab-label">Home</span>
      </NavLink>

      {/* 프로필 없어서 임시로 /login으로 연결해둠! */}
      <NavLink to="/login" className={({ isActive }) => "tab-item" + (isActive ? " active" : "")}>
        <svg viewBox="0 0 24 24" className="tab-icon" aria-hidden="true">
          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14z" fill="currentColor"/>
        </svg>
        <span className="tab-label">Profile</span>
      </NavLink>
    </nav>
  );
}