import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import type { ReactElement } from "react";

import { useAuth } from "./AuthContext";
import Navbar from "./components/Navbar";
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
  const { language } = usePreferences();

  return (
    <div className="app">
      <Navbar />

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