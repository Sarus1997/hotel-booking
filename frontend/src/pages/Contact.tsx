import { usePreferences } from "../PreferencesContext";

export default function Contact() {
  const { language } = usePreferences();
  const thai = language === "th";

  return (
    <div className="content-page">
      <section className="contact-section contact-page" id="contact">
        <div>
          <p className="eyebrow">WE ARE HERE FOR YOU</p>
          <h1>{thai ? "ติดต่อเรา" : "Contact us"}</h1>
          <p>
            {thai ? "ทีมงาน Devin Hotel พร้อมดูแลทุกคำถามและช่วยวางแผนการเข้าพักของคุณ" : "Our Devin Hotel team is ready to answer your questions and help plan your stay."}
          </p>
        </div>
        <div className="contact-details">
          <a href="tel:+6620000000">
            <span>{thai ? "โทรศัพท์" : "Phone"}</span>
            <strong>02 000 0000</strong>
          </a>
          <a href="mailto:hello@devinhotel.com">
            <span>{thai ? "อีเมล" : "Email"}</span>
            <strong>hello@devinhotel.com</strong>
          </a>
          <div>
            <span>{thai ? "เวลาทำการ" : "Opening hours"}</span>
            <strong>{thai ? "ทุกวัน 08:00–22:00 น." : "Daily, 08:00–22:00"}</strong>
          </div>
          <div>
            <span>{thai ? "ที่อยู่" : "Location"}</span>
            <strong>{thai ? "ใจกลางเมือง เดินทางสะดวก" : "Central city, easy to reach"}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
