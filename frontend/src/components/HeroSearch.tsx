import type { FormEvent } from "react";

interface HeroSearchProps {
  thai: boolean;
  checkIn: string;
  checkOut: string;
  guests: number;
  loading: boolean;
  minDate: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onGuestsChange: (value: number) => void;
  onSubmit: (event: FormEvent) => void;
}

export default function HeroSearch({
  thai,
  checkIn,
  checkOut,
  guests,
  loading,
  minDate,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onSubmit,
}: HeroSearchProps) {
  return (
    <section className="hero">
      <img
        className="hero-image"
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=85"
        alt=""
        aria-hidden="true"
      />
      <h1>{thai ? "ค้นหาห้องพักที่ใช่สำหรับคุณ" : "Find your perfect stay"}</h1>
      <p>{thai ? "โรงแรมเดวินรีสอร์ท · ห้องพักสะอาด บริการอบอุ่น ใจกลางเมือง" : "Devin Hotel · Thoughtful rooms and warm hospitality in the heart of the city"}</p>
      <form className="search-bar" onSubmit={onSubmit}>
        <label>
          {thai ? "เช็คอิน" : "Check-in"}
          <input type="date" value={checkIn} min={minDate} onChange={(event) => onCheckInChange(event.target.value)} required />
        </label>
        <label>
          {thai ? "เช็คเอาท์" : "Check-out"}
          <input type="date" value={checkOut} min={checkIn} onChange={(event) => onCheckOutChange(event.target.value)} required />
        </label>
        <label>
          {thai ? "ผู้เข้าพัก" : "Guests"}
          <select value={guests} onChange={(event) => onGuestsChange(Number(event.target.value))}>
            {[1, 2, 3, 4, 5].map((count) => (
              <option key={count} value={count}>
                {count} {thai ? "ท่าน" : count === 1 ? "guest" : "guests"}
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
  );
}
