import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../api";
import { useAuth } from "../AuthContext";
import BookingModal from "../components/BookingModal";
import HeroSearch from "../components/HeroSearch";
import PromoStrip from "../components/PromoStrip";
import RoomCard from "../components/RoomCard";
import { usePreferences } from "../PreferencesContext";
import type { AvailableRoomType } from "../types";
import { todayISO } from "../utils";

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
      <HeroSearch
        thai={thai}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        loading={loading}
        minDate={todayISO()}
        onCheckInChange={setCheckIn}
        onCheckOutChange={setCheckOut}
        onGuestsChange={setGuests}
        onSubmit={runSearch}
      />
      <PromoStrip thai={thai} />

      {error && <p className="alert error">{error}</p>}
      {message && <p className="alert success">{message}</p>}

      <section className="room-grid">
        {loading && (
          <div className="loading-grid" aria-label={thai ? "กำลังโหลดห้องพัก" : "Loading rooms"}>
            {[1, 2, 3].map((item) => <div className="skeleton" key={item} />)}
          </div>
        )}
        {results?.length === 0 && !loading && (
          <p className="empty">
            {thai ? "ไม่พบห้องว่างในช่วงวันที่ที่เลือก ลองเปลี่ยนวันที่ดูนะครับ" : "No rooms are available for these dates. Try another range."}
          </p>
        )}
        {!loading && results?.map((roomType) => (
          <RoomCard key={roomType.id} roomType={roomType} thai={thai} onBook={onBookClick} />
        ))}
      </section>

      {booking && (
        <BookingModal
          booking={booking}
          thai={thai}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          note={note}
          loading={bookingLoading}
          onNoteChange={setNote}
          onCancel={() => setBooking(null)}
          onConfirm={confirmBooking}
        />
      )}
    </div>
  );
}
