import { Link, useLocation } from "react-router-dom";
import "./AdminBottomTab.css";

export default function AdminBottomTab() {
  const location = useLocation();

  return (
    <footer className="AdminBottomTab">
      <nav className="AdminTabNav">
        <Link
          to="/admin"
          className={`AdminTabItem ${location.pathname === "/admin" ? "active" : ""}`}
        >
          <span className="icon">🏠</span>
          <span className="label">Home</span>
        </Link>

        <Link
          to="/admin/stock"
          className={`AdminTabItem ${location.pathname === "/admin/stock" ? "active" : ""}`}
        >
          <span className="icon">📦</span>
          <span className="label">Stock</span>
        </Link>

        <Link
          to="/admin/profile"
          className={`AdminTabItem ${location.pathname === "/admin/profile" ? "active" : ""}`}
        >
          <span className="icon">👤</span>
          <span className="label">Profile</span>
        </Link>
      </nav>
    </footer>
  );
}