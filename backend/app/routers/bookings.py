import secrets
import string

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..availability import available_rooms, nights_between, validate_range
from ..database import get_db
from ..models import Booking, RoomType, User
from ..schemas import BookingCreate, BookingOut
from ..security import get_current_user

router = APIRouter(prefix="/api/bookings", tags=["bookings"])

CANCELLABLE_STATUSES = ("confirmed",)


def generate_code(db: Session) -> str:
    alphabet = string.ascii_uppercase + string.digits
    while True:
        code = "BK" + "".join(secrets.choice(alphabet) for _ in range(6))
        if not db.query(Booking).filter(Booking.code == code).first():
            return code


@router.post("", response_model=BookingOut, status_code=201)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Booking:
    error = validate_range(payload.check_in, payload.check_out)
    if error:
        raise HTTPException(status_code=400, detail=error)

    room_type = db.get(RoomType, payload.room_type_id)
    if not room_type:
        raise HTTPException(status_code=404, detail="ไม่พบประเภทห้องพัก")
    if payload.guests > room_type.capacity:
        raise HTTPException(
            status_code=400,
            detail=f"ห้องประเภทนี้รองรับได้สูงสุด {room_type.capacity} ท่าน",
        )

    rooms = available_rooms(db, payload.check_in, payload.check_out, room_type.id)
    if not rooms:
        raise HTTPException(status_code=409, detail="ห้องพักประเภทนี้เต็มในช่วงวันที่เลือก")

    nights = nights_between(payload.check_in, payload.check_out)
    subtotal = round(room_type.price_per_night * nights, 2)
    discount = min(user.discount_credit, subtotal)
    booking = Booking(
        code=generate_code(db),
        user_id=user.id,
        room_id=rooms[0].id,
        check_in=payload.check_in,
        check_out=payload.check_out,
        guests=payload.guests,
        total_price=round(subtotal - discount, 2),
        discount_amount=discount,
        status="confirmed",
        note=payload.note,
    )
    if discount:
        user.discount_credit = round(user.discount_credit - discount, 2)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/me", response_model=list[BookingOut])
def my_bookings(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
) -> list[Booking]:
    return (
        db.query(Booking)
        .filter(Booking.user_id == user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )


@router.post("/{booking_id}/cancel", response_model=BookingOut)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Booking:
    booking = db.get(Booking, booking_id)
    if not booking or (booking.user_id != user.id and user.role != "admin"):
        raise HTTPException(status_code=404, detail="ไม่พบการจองนี้")
    if booking.status not in CANCELLABLE_STATUSES:
        raise HTTPException(status_code=400, detail="การจองนี้ไม่สามารถยกเลิกได้")
    booking.status = "cancelled"
    db.commit()
    db.refresh(booking)
    return booking
