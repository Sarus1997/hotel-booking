from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..availability import overlapping_room_ids
from ..database import get_db
from ..models import Booking, Room, RoomType, User
from ..schemas import (
    BookingOut,
    BookingStatusUpdate,
    DashboardStats,
    RoomCreate,
    RoomOut,
    RoomTypeCreate,
    RoomTypeOut,
    UserOut,
)
from ..security import get_current_admin

router = APIRouter(
    prefix="/api/admin", tags=["admin"], dependencies=[Depends(get_current_admin)]
)

VALID_BOOKING_STATUSES = ("confirmed", "checked_in", "checked_out", "cancelled")


@router.get("/stats", response_model=DashboardStats)
def stats(db: Session = Depends(get_db)) -> DashboardStats:
    total_rooms = db.query(Room).count()
    bookings = db.query(Booking).all()
    active = [b for b in bookings if b.status in ("confirmed", "checked_in")]
    revenue = sum(b.total_price for b in bookings if b.status != "cancelled")
    today = date.today()
    occupied = len(overlapping_room_ids(db, today, date.fromordinal(today.toordinal() + 1)))
    return DashboardStats(
        total_rooms=total_rooms,
        total_bookings=len(bookings),
        active_bookings=len(active),
        total_users=db.query(User).count(),
        revenue=round(revenue, 2),
        occupancy_rate=round(occupied / total_rooms * 100, 1) if total_rooms else 0.0,
    )


@router.get("/bookings", response_model=list[BookingOut])
def all_bookings(db: Session = Depends(get_db)) -> list[Booking]:
    return db.query(Booking).order_by(Booking.created_at.desc()).all()


@router.patch("/bookings/{booking_id}", response_model=BookingOut)
def update_booking_status(
    booking_id: int, payload: BookingStatusUpdate, db: Session = Depends(get_db)
) -> Booking:
    if payload.status not in VALID_BOOKING_STATUSES:
        raise HTTPException(status_code=400, detail="สถานะไม่ถูกต้อง")
    booking = db.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="ไม่พบการจองนี้")
    booking.status = payload.status
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/users", response_model=list[UserOut])
def all_users(db: Session = Depends(get_db)) -> list[User]:
    return db.query(User).order_by(User.created_at.desc()).all()


@router.post("/room-types", response_model=RoomTypeOut, status_code=201)
def create_room_type(payload: RoomTypeCreate, db: Session = Depends(get_db)) -> RoomType:
    if db.query(RoomType).filter(RoomType.name == payload.name).first():
        raise HTTPException(status_code=400, detail="มีประเภทห้องชื่อนี้แล้ว")
    room_type = RoomType(**payload.model_dump())
    db.add(room_type)
    db.commit()
    db.refresh(room_type)
    return room_type


@router.put("/room-types/{room_type_id}", response_model=RoomTypeOut)
def update_room_type(
    room_type_id: int, payload: RoomTypeCreate, db: Session = Depends(get_db)
) -> RoomType:
    room_type = db.get(RoomType, room_type_id)
    if not room_type:
        raise HTTPException(status_code=404, detail="ไม่พบประเภทห้องพัก")
    for key, value in payload.model_dump().items():
        setattr(room_type, key, value)
    db.commit()
    db.refresh(room_type)
    return room_type


@router.get("/rooms", response_model=list[RoomOut])
def all_rooms(db: Session = Depends(get_db)) -> list[Room]:
    return db.query(Room).order_by(Room.room_number).all()


@router.post("/rooms", response_model=RoomOut, status_code=201)
def create_room(payload: RoomCreate, db: Session = Depends(get_db)) -> Room:
    if not db.get(RoomType, payload.room_type_id):
        raise HTTPException(status_code=404, detail="ไม่พบประเภทห้องพัก")
    if db.query(Room).filter(Room.room_number == payload.room_number).first():
        raise HTTPException(status_code=400, detail="มีเลขห้องนี้แล้ว")
    room = Room(**payload.model_dump())
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


@router.delete("/rooms/{room_id}", status_code=204)
def delete_room(room_id: int, db: Session = Depends(get_db)) -> None:
    room = db.get(Room, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="ไม่พบห้องพัก")
    if db.query(Booking).filter(Booking.room_id == room_id).count():
        raise HTTPException(status_code=400, detail="ห้องนี้มีประวัติการจอง ไม่สามารถลบได้")
    db.delete(room)
    db.commit()
