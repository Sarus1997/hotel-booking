import { useEffect, useState } from "react";

import { api } from "../api";
import type { Booking, Loyalty } from "../types";
import { STATUS_LABELS, formatBaht, formatDate } from "../utils";

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loyalty, setLoyalty] = useState<Loyalty | null>(null);

  async function load() {
    setLoading(true);
    try {
      setBookings(await api.myBookings());
      setLoyalty(await api.loyalty());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function cancel(id: number) {
    if (!confirm("ต้องการยกเลิกการจองนี้ใช่หรือไม่?")) return;
    try {
      await api.cancelBooking(id);
      void load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function redeem(points: number) {
    try {
      setLoyalty(await api.redeemPoints(points));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="page">
      <h2>การจองของฉัน</h2>
      {loyalty && (
        <section className="loyalty-panel">
          <div>
            <p className="muted">คะแนนสะสม</p>
            <strong className="points-total">{loyalty.points_balance.toLocaleString()} คะแนน</strong>
            <p className="muted small">สะสมแล้วทั้งหมด {loyalty.lifetime_points.toLocaleString()} คะแนน</p>
          </div>
          <div>
            <p className="muted">เครดิตส่วนลด</p>
            <strong>{formatBaht(loyalty.discount_credit)}</strong>
            <p className="muted small">ระบบจะใช้ลดการจองครั้งถัดไปอัตโนมัติ</p>
          </div>
          <div className="rewards">
            {loyalty.rewards.map((reward) => (
              <button
                className="ghost"
                key={reward.points}
                disabled={loyalty.points_balance < reward.points}
                onClick={() => void redeem(reward.points)}
              >
                แลก {reward.label}
              </button>
            ))}
          </div>
        </section>
      )}
      {error && <p className="alert error">{error}</p>}
      {loading && <p className="muted">กำลังโหลด...</p>}
      {!loading && bookings.length === 0 && <p className="empty">ยังไม่มีการจอง</p>}
      <div className="booking-list">
        {bookings.map((booking) => (
          <article className="booking-card" key={booking.id}>
            <div>
              <h3>
                {booking.room.room_type.name} · ห้อง {booking.room.room_number}
              </h3>
              <p className="muted">
                รหัสการจอง {booking.code} · {formatDate(booking.check_in)} –{" "}
                {formatDate(booking.check_out)} · {booking.guests} ท่าน
              </p>
              {booking.note && <p className="muted small">หมายเหตุ: {booking.note}</p>}
            </div>
            <div className="booking-right">
              <span className={`badge ${booking.status}`}>
                {STATUS_LABELS[booking.status]}
              </span>
              <strong>{formatBaht(booking.total_price)}</strong>
              {booking.status === "confirmed" && (
                <button className="ghost" onClick={() => cancel(booking.id)}>
                  ยกเลิก
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
