import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { useAuth } from "../AuthContext";
import { usePreferences } from "../PreferencesContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, theme, toggleLanguage, toggleTheme } = usePreferences();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const thai = language === "th";

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setMenuOpen(false);
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : undefined;

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Devin Hotel
      </Link>
      <button
        type="button"
        className="menu-toggle"
        aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>
      {menuOpen && (
        <button type="button" className="sidebar-backdrop" aria-label="ปิดเมนู" onClick={closeMenu} />
      )}
      <nav className={menuOpen ? "open" : ""}>
        <button type="button" className="sidebar-close" aria-label="ปิดเมนู" onClick={closeMenu}>
          ×
        </button>
        <NavLink to="/" end className={navLinkClass}>{thai ? "ค้นหาห้องพัก" : "Find a room"}</NavLink>
        <NavLink to="/services" className={navLinkClass}>{thai ? "บริการของเรา" : "Our services"}</NavLink>
        <NavLink to="/contact" className={navLinkClass}>{thai ? "ติดต่อเรา" : "Contact us"}</NavLink>
        {user && <NavLink to="/my-bookings" className={navLinkClass}>{thai ? "การจองของฉัน" : "My bookings"}</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin" className={navLinkClass}>{thai ? "ผู้ดูแลระบบ" : "Admin"}</NavLink>}
        {user ? (
          <>
            <span className="muted">
              {thai ? "สวัสดี" : "Hello"}, {user.full_name} · {user.points_balance} {thai ? "คะแนน" : "points"}
            </span>
            <button type="button" className="ghost" onClick={() => { logout(); closeMenu(); }}>
              {thai ? "ออกจากระบบ" : "Log out"}
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={navLinkClass}>{thai ? "เข้าสู่ระบบ" : "Log in"}</NavLink>
            <Link to="/register" className="cta">{thai ? "สมัครสมาชิก" : "Sign up"}</Link>
          </>
        )}
        <div className="preference-controls">
          <button type="button" className="preference-button" aria-label="สลับธีม" onClick={toggleTheme}>
            {theme === "dark" ? "☼ Light" : "☾ Dark"}
          </button>
          <button type="button" className="preference-button" aria-label="เปลี่ยนภาษา" onClick={toggleLanguage}>
            {thai ? "EN" : "TH"}
          </button>
        </div>
      </nav>
    </header>
  );
}
