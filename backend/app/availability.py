from datetime import date

from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from .models import Booking, Room

BLOCKING_STATUSES = ("confirmed", "checked_in")


def overlapping_room_ids(db: Session, check_in: date, check_out: date) -> set[int]:
    stmt = select(Booking.room_id).where(
        and_(
            Booking.status.in_(BLOCKING_STATUSES),
            Booking.check_in < check_out,
            Booking.check_out > check_in,
        )
    )
    return set(db.scalars(stmt).all())


def available_rooms(
    db: Session, check_in: date, check_out: date, room_type_id: int | None = None
) -> list[Room]:
    booked = overlapping_room_ids(db, check_in, check_out)
    stmt = select(Room).where(Room.status == "available")
    if room_type_id is not None:
        stmt = stmt.where(Room.room_type_id == room_type_id)
    rooms = db.scalars(stmt).all()
    return [room for room in rooms if room.id not in booked]


def nights_between(check_in: date, check_out: date) -> int:
    return (check_out - check_in).days


def validate_range(check_in: date, check_out: date) -> str | None:
    if check_out <= check_in:
        return "วันที่เช็คเอาท์ต้องหลังวันที่เช็คอิน"
    if nights_between(check_in, check_out) > 30:
        return "จองได้สูงสุด 30 คืนต่อครั้ง"
    return None


