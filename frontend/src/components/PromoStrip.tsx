import { Link } from "react-router-dom";

export default function PromoStrip({ thai }: { thai: boolean }) {
  return (
    <section className="promo-strip" aria-label={thai ? "ประชาสัมพันธ์" : "Announcement"}>
      <span className="promo-mark">✦</span>
      <div>
        <strong>{thai ? "สิทธิพิเศษสำหรับสมาชิกใหม่" : "A welcome gift for new members"}</strong>
        <p>{thai ? "สมัครวันนี้ รับสิทธิ์สะสมคะแนนและข้อเสนอพิเศษจากเรา" : "Join today to start earning points and unlock member-only offers."}</p>
      </div>
      <Link to="/services">{thai ? "ดูบริการทั้งหมด" : "Explore services"} <span aria-hidden="true">→</span></Link>
    </section>
  );
}
