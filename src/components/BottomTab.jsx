import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./BottomTab.css";

export default function BottomTab() {
  const { user } = useAuth() ?? {};
  const navigate = useNavigate();
  const location = useLocation();

  const goProfile = () => {
    if (user) navigate("/mypage");
    else navigate("/login", { state: { from: location } });
  };

  const isProfileActive = location.pathname.startsWith("/mypage");

  return (
    <nav className="bottom-tab">
      <NavLink
        to="/"
        className={({ isActive }) => "tab-item" + (isActive ? " active" : "")}
      >
        {/* 홈 아이콘 */}
        <svg viewBox="0 0 24 24" className="tab-icon" aria-hidden="true">
          <path d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5v-9z" fill="currentColor"/>
        </svg>
        <span className="tab-label">Home</span>
      </NavLink>

      {/* 프로필: 로그인 여부에 따라 /mypage 또는 /login 으로 */}
      <button
        type="button"
        onClick={goProfile}
        className={"tab-item tab-button" + (isProfileActive ? " active" : "")}
        aria-current={isProfileActive ? "page" : undefined}
      >
        <svg viewBox="0 0 24 24" className="tab-icon" aria-hidden="true">
          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14z" fill="currentColor"/>
        </svg>
        <span className="tab-label">Profile</span>
      </button>
    </nav>
  );
}
