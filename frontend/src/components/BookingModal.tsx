import type { AvailableRoomType } from "../types";
import { formatBaht } from "../utils";

interface BookingModalProps {
  booking: AvailableRoomType;
  thai: boolean;
  checkIn: string;
  checkOut: string;
  guests: number;
  note: string;
  loading: boolean;
  onNoteChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function BookingModal({
  booking,
  thai,
  checkIn,
  checkOut,
  guests,
  note,
  loading,
  onNoteChange,
  onCancel,
  onConfirm,
}: BookingModalProps) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h2>{thai ? "ยืนยันการจอง" : "Confirm booking"}</h2>
        <p className="muted">{booking.name}</p>
        <dl className="summary">
          <div><dt>{thai ? "เช็คอิน" : "Check-in"}</dt><dd>{checkIn}</dd></div>
          <div><dt>{thai ? "เช็คเอาท์" : "Check-out"}</dt><dd>{checkOut}</dd></div>
          <div><dt>{thai ? "ผู้เข้าพัก" : "Guests"}</dt><dd>{guests} {thai ? "ท่าน" : guests === 1 ? "guest" : "guests"}</dd></div>
          <div><dt>{thai ? "ราคารวม" : "Total"}</dt><dd>{formatBaht(booking.total_price)}</dd></div>
        </dl>
        <label>
          {thai ? "หมายเหตุถึงโรงแรม" : "Note for the hotel"}
          <textarea
            value={note}
            rows={3}
            placeholder={thai ? "เช่น ขอห้องชั้นสูง, เตียงเสริม" : "For example, a high floor or extra bed"}
            onChange={(event) => onNoteChange(event.target.value)}
          />
        </label>
        <div className="modal-actions">
          <button className="ghost" onClick={onCancel}>{thai ? "ยกเลิก" : "Cancel"}</button>
          <button onClick={onConfirm} disabled={loading}>
            {loading && <span className="spinner" aria-hidden="true" />}
            {loading ? (thai ? "กำลังยืนยัน..." : "Confirming...") : thai ? "ยืนยันการจอง" : "Confirm booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
