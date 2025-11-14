import { Link, useLocation } from "react-router-dom";
import "./AdminBottomTab.css";

export default function AdminBottomTab() {
  const location = useLocation();

  return (
    <footer className="AdminBottomTab">
      <nav className="AdminTabNav">

        {/* Home */}
        <Link
          to="/admin"
          className={`AdminTabItem ${location.pathname === "/admin" ? "active" : ""}`}
        >
          <svg viewBox="0 0 24 24" className="tab-icon" aria-hidden="true">
            <path
              d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5v-9z"
              fill="currentColor"
            />
          </svg>
          <span className="label">Home</span>
        </Link>

        {/* Stock (새 아이콘 필요하면 말해줘) */}
        <Link
          to="/admin/stock"
          className={`AdminTabItem ${location.pathname === "/admin/stock" ? "active" : ""}`}
        >
          <svg viewBox="0 0 24 24" className="tab-icon" aria-hidden="true">
            <path
              d="M3 6l9-4 9 4v12l-9 4-9-4z"
              fill="currentColor"
            />
          </svg>
          <span className="label">Stock</span>
        </Link>

        {/* Profile */}
        <Link
          to="/admin/profile"
          className={`AdminTabItem ${location.pathname === "/admin/profile" ? "active" : ""}`}
        >
          <svg viewBox="0 0 24 24" className="tab-icon" aria-hidden="true">
            <path
              d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14z"
              fill="currentColor"
            />
          </svg>
          <span className="label">Profile</span>
        </Link>

      </nav>
    </footer>
  );
}