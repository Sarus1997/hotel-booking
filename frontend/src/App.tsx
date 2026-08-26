import { Link, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";

import { useAuth } from "./AuthContext";
import { usePreferences } from "./PreferencesContext";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import Register from "./pages/Register";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

function Protected({
  children,
  adminOnly = false,
}: {
  children: ReactElement;
  adminOnly?: boolean;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <p className="muted page">กำลังโหลด...</p>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user, logout } = useAuth();
  const { language, theme, toggleLanguage, toggleTheme } = usePreferences();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  function closeMenu() {
    setMenuOpen(false);
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : undefined;

  return (
    <div className="app">
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
          <button
            type="button"
            className="sidebar-backdrop"
            aria-label="ปิดเมนู"
            onClick={closeMenu}
          />
        )}
        <nav className={menuOpen ? "open" : ""}>
          <button type="button" className="sidebar-close" aria-label="ปิดเมนู" onClick={closeMenu}>
            ×
          </button>
          <NavLink to="/" end className={navLinkClass}>
            {language === "th" ? "ค้นหาห้องพัก" : "Find a room"}
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            {language === "th" ? "บริการของเรา" : "Our services"}
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            {language === "th" ? "ติดต่อเรา" : "Contact us"}
          </NavLink>
          {user && (
            <NavLink to="/my-bookings" className={navLinkClass}>
              {language === "th" ? "การจองของฉัน" : "My bookings"}
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass}>
              {language === "th" ? "ผู้ดูแลระบบ" : "Admin"}
            </NavLink>
          )}
          {user ? (
            <>
              <span className="muted">
                {language === "th" ? "สวัสดี" : "Hello"}, {user.full_name} · {user.points_balance} {language === "th" ? "คะแนน" : "points"}
              </span>
              <button
                className="ghost"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                {language === "th" ? "ออกจากระบบ" : "Log out"}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                {language === "th" ? "เข้าสู่ระบบ" : "Log in"}
              </NavLink>
              <Link to="/register" className="cta">
                {language === "th" ? "สมัครสมาชิก" : "Sign up"}
              </Link>
            </>
          )}
          <div className="preference-controls">
            <button
              type="button"
              className="preference-button"
              aria-label="สลับธีม"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "☼" : "☾"} {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button
              type="button"
              className="preference-button"
              aria-label="เปลี่ยนภาษา"
              onClick={toggleLanguage}
            >
              {language === "th" ? "EN" : "TH"}
            </button>
          </div>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/my-bookings"
            element={
              <Protected>
                <MyBookings />
              </Protected>
            }
          />
          <Route
            path="/admin"
            element={
              <Protected adminOnly>
                <Admin />
              </Protected>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer">
        <span>© 2026 Devin Hotel · {language === "th" ? "ระบบจองห้องพักโรงแรม" : "Hotel booking system"}</span>
      </footer>
    </div>
  );
}