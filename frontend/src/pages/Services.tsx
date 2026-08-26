import { usePreferences } from "../PreferencesContext";

const SERVICES = [
  {
    icon: "01",
    title: { th: "อาหารเช้าท้องถิ่น", en: "Local breakfast" },
    description: { th: "เริ่มต้นวันใหม่ด้วยเมนูสดใหม่จากวัตถุดิบในชุมชน", en: "Start your day with fresh dishes made from local ingredients." },
  },
  {
    icon: "02",
    title: { th: "รถรับส่งสนามบิน", en: "Airport transfers" },
    description: { th: "เดินทางสบายด้วยบริการรับส่งที่จองล่วงหน้าได้", en: "Travel with ease using our pre-bookable airport transfer service." },
  },
  {
    icon: "03",
    title: { th: "สระว่ายน้ำและสปา", en: "Pool and spa" },
    description: { th: "ผ่อนคลายกับสระน้ำอุ่นและทรีตเมนต์ดูแลร่างกาย", en: "Unwind with a warm pool and restorative wellness treatments." },
  },
  {
    icon: "04",
    title: { th: "ห้องประชุมส่วนตัว", en: "Private meeting room" },
    description: { th: "พื้นที่พร้อมอุปกรณ์สำหรับประชุมและจัดงานขนาดเล็ก", en: "A fully equipped space for meetings and intimate events." },
  },
];

export default function Services() {
  const { language } = usePreferences();
  const text = language === "th" ? "th" : "en";

  return (
    <div className="content-page">
      <section className="info-section services-page" id="services">
        <div className="section-heading">
          <p className="eyebrow">STAY A LITTLE LONGER</p>
          <h1>{text === "th" ? "บริการของเรา" : "Our services"}</h1>
          <p className="muted">
            {text === "th" ? "ทุกช่วงเวลาที่ Devin Hotel มีความหมาย ด้วยบริการเล็ก ๆ ที่ทำให้การเข้าพักของคุณราบรื่น" : "Every moment at Devin Hotel matters, with thoughtful services to make your stay effortless."}
          </p>
        </div>
        <div className="service-grid">
          {SERVICES.map((service) => (
            <article className="service-card" key={service.title.th}>
              <span className="service-number">{service.icon}</span>
              <h2>{service.title[text]}</h2>
              <p className="muted">{service.description[text]}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
