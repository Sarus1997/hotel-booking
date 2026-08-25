import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import type { ReactElement } from "react";

import { useAuth } from "./AuthContext";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import Register from "./pages/Register";

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

  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="brand">
          🏨 Devin Hotel
        </Link>
        <nav>
          <Link to="/">ค้นหาห้องพัก</Link>
          {user && <Link to="/my-bookings">การจองของฉัน</Link>}
          {user?.role === "admin" && <Link to="/admin">ผู้ดูแลระบบ</Link>}
          {user ? (
            <>
              <span className="muted">สวัสดี, {user.full_name}</span>
              <button className="ghost" onClick={logout}>
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link to="/login">เข้าสู่ระบบ</Link>
              <Link to="/register" className="cta">
                สมัครสมาชิก
              </Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
        <span>© 2026 Devin Hotel · ระบบจองห้องพักโรงแรม</span>
      </footer>
    </div>
  );
}
