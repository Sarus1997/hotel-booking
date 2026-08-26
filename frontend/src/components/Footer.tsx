import { usePreferences } from "../PreferencesContext";
import { Link } from "react-router-dom";

export default function Footer() {
  const { language } = usePreferences();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Devin Hotel</Link>
          <p>{language === "th" ? "ช่วงเวลาพักผ่อนที่ออกแบบมาเพื่อคุณ" : "Thoughtful stays, made for you."}</p>
        </div>
        <div className="footer-links">
          <span>{language === "th" ? "ไปยัง" : "Explore"}</span>
          <Link to="/">{language === "th" ? "ค้นหาห้องพัก" : "Find a room"}</Link>
          <Link to="/services">{language === "th" ? "บริการของเรา" : "Our services"}</Link>
          <Link to="/contact">{language === "th" ? "ติดต่อเรา" : "Contact us"}</Link>
        </div>
        <div className="footer-contact">
          <span>{language === "th" ? "พูดคุยกับเรา" : "Talk to us"}</span>
          <a href="tel:+6620000000">02 000 0000</a>
          <a href="mailto:hello@devinhotel.com">hello@devinhotel.com</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Devin Hotel · {language === "th" ? "ระบบจองห้องพักโรงแรม" : "Hotel booking system"}</span>
        <span>{language === "th" ? "พักดี มีความหมาย" : "Stay well. Stay meaningfully."}</span>
      </div>
    </footer>
  );
}