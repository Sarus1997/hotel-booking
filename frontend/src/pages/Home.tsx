import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../api";
import { useAuth } from "../AuthContext";
import { usePreferences } from "../PreferencesContext";
import type { AvailableRoomType } from "../types";
import { formatBaht, todayISO } from "../utils";

export default function Home() {
  const { user } = useAuth();
  const { language } = usePreferences();
  const thai = language === "th";
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState(todayISO(1));
  const [checkOut, setCheckOut] = useState(todayISO(3));
  const [guests, setGuests] = useState(2);
  const [results, setResults] = useState<AvailableRoomType[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState<AvailableRoomType | null>(null);
  const [note, setNote] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    void runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch(event?: React.FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    if (event) setMessage("");
    try {
      setResults(await api.search(checkIn, checkOut, guests));
    } catch (err) {
      setError((err as Error).message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function confirmBooking() {
    if (!booking) return;
    setError("");
    setBookingLoading(true);
    try {
      const created = await api.createBooking({
        room_type_id: booking.id,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        note,
      });
      setBooking(null);
      setNote("");
      setMessage(`จองสำเร็จ! รหัสการจองของคุณคือ ${created.code}`);
      void runSearch();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBookingLoading(false);
    }
  }

  function onBookClick(roomType: AvailableRoomType) {
    if (!user) {
      navigate("/login");
      return;
    }
    setBooking(roomType);
  }

  return (
    <div>
      <section className="hero">
        <h1>{thai ? "ค้นหาห้องพักที่ใช่สำหรับคุณ" : "Find your perfect stay"}</h1>
        <p>{thai ? "โรงแรมเดวินรีสอร์ท · ห้องพักสะอาด บริการอบอุ่น ใจกลางเมือง" : "Devin Hotel · Thoughtful rooms and warm hospitality in the heart of the city"}</p>
        <form className="search-bar" onSubmit={runSearch}>
          <label>
            {thai ? "เช็คอิน" : "Check-in"}
            <input
              type="date"
              value={checkIn}
              min={todayISO()}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </label>
          <label>
            {thai ? "เช็คเอาท์" : "Check-out"}
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </label>
          <label>
            {thai ? "ผู้เข้าพัก" : "Guests"}
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} {thai ? "ท่าน" : n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={loading}>
            {loading && <span className="spinner" aria-hidden="true" />}
            {loading ? (thai ? "กำลังค้นหา..." : "Searching...") : thai ? "ค้นหาห้องว่าง" : "Search rooms"}
          </button>
        </form>
      </section>

      {error && <p className="alert error">{error}</p>}
      {message && <p className="alert success">{message}</p>}

      <section className="room-grid">
        {loading && (
          <div className="loading-grid" aria-label="กำลังโหลดห้องพัก">
            {[1, 2, 3].map((item) => <div className="skeleton" key={item} />)}
          </div>
        )}
        {results?.length === 0 && !loading && (
          <p className="empty">ไม่พบห้องว่างในช่วงวันที่ที่เลือก ลองเปลี่ยนวันที่ดูนะครับ</p>
        )}
        {!loading && results?.map((roomType) => (
          <article className="room-card" key={roomType.id}>
            <img src={roomType.image_url} alt={roomType.name} loading="lazy" />
            <div className="room-card-body">
              <h3>{roomType.name}</h3>
              <p className="muted">{roomType.description}</p>
              <ul className="facts">
                <li>รองรับ {roomType.capacity} ท่าน</li>
                <li>ว่าง {roomType.available_rooms} ห้อง</li>
                <li>{roomType.nights} คืน</li>
              </ul>
              <div className="price-row">
                <div>
                  <strong>{formatBaht(roomType.price_per_night)}</strong>
                  <span className="muted"> / คืน</span>
                  <div className="muted">รวม {formatBaht(roomType.total_price)}</div>
                </div>
                <button onClick={() => onBookClick(roomType)}>{thai ? "จองเลย" : "Book now"}</button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {booking && (
        <div className="modal-backdrop" onClick={() => setBooking(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>ยืนยันการจอง</h2>
            <p className="muted">{booking.name}</p>
            <dl className="summary">
              <div>
                <dt>เช็คอิน</dt>
                <dd>{checkIn}</dd>
              </div>
              <div>
                <dt>เช็คเอาท์</dt>
                <dd>{checkOut}</dd>
              </div>
              <div>
                <dt>ผู้เข้าพัก</dt>
                <dd>{guests} ท่าน</dd>
              </div>
              <div>
                <dt>ราคารวม</dt>
                <dd>{formatBaht(booking.total_price)}</dd>
              </div>
            </dl>
            <label>
              หมายเหตุถึงโรงแรม
              <textarea
                value={note}
                rows={3}
                placeholder="เช่น ขอห้องชั้นสูง, เตียงเสริม"
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
            <div className="modal-actions">
              <button className="ghost" onClick={() => setBooking(null)}>
                ยกเลิก
              </button>
              <button onClick={confirmBooking} disabled={bookingLoading}>
                {bookingLoading && <span className="spinner" aria-hidden="true" />}
                {bookingLoading ? "กำลังยืนยัน..." : "ยืนยันการจอง"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
