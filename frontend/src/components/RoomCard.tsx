import type { AvailableRoomType } from "../types";
import { getRoomCopy } from "../roomTranslations";
import { formatBaht } from "../utils";

interface RoomCardProps {
  roomType: AvailableRoomType;
  thai: boolean;
  onBook: (roomType: AvailableRoomType) => void;
}

export default function RoomCard({ roomType, thai, onBook }: RoomCardProps) {
  const copy = getRoomCopy(roomType, thai);

  return (
    <article className="room-card">
      <img src={roomType.image_url} alt={copy.name} loading="lazy" />
      <div className="room-card-body">
        <h3>{copy.name}</h3>
        <p className="muted">{copy.description}</p>
        <ul className="facts">
          <li>{thai ? "รองรับ" : "Up to"} {roomType.capacity} {thai ? "ท่าน" : "guests"}</li>
          <li>{thai ? "ว่าง" : "Available"} {roomType.available_rooms}</li>
          <li>{roomType.nights} {thai ? "คืน" : roomType.nights === 1 ? "night" : "nights"}</li>
        </ul>
        <div className="price-row">
          <div>
            <strong>{formatBaht(roomType.price_per_night)}</strong>
            <span className="muted"> / {thai ? "คืน" : "night"}</span>
            <div className="muted">{thai ? "รวม" : "Total"} {formatBaht(roomType.total_price)}</div>
          </div>
          <button onClick={() => onBook(roomType)}>{thai ? "จองเลย" : "Book now"}</button>
        </div>
      </div>
    </article>
  );
}
