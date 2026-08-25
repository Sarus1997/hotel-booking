from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..availability import available_rooms, nights_between, validate_range
from ..database import get_db
from ..models import RoomType
from ..schemas import AvailableRoomType, RoomTypeOut

router = APIRouter(prefix="/api/room-types", tags=["rooms"])


@router.get("", response_model=list[RoomTypeOut])
def list_room_types(db: Session = Depends(get_db)) -> list[RoomType]:
    return db.query(RoomType).order_by(RoomType.price_per_night).all()


@router.get("/search", response_model=list[AvailableRoomType])
def search(
    check_in: date,
    check_out: date,
    guests: int = Query(default=1, ge=1, le=10),
    db: Session = Depends(get_db),
) -> list[AvailableRoomType]:
    error = validate_range(check_in, check_out)
    if error:
        raise HTTPException(status_code=400, detail=error)

    nights = nights_between(check_in, check_out)
    rooms = available_rooms(db, check_in, check_out)
    counts: dict[int, int] = {}
    for room in rooms:
        counts[room.room_type_id] = counts.get(room.room_type_id, 0) + 1

    results = []
    room_types = (
        db.query(RoomType)
        .filter(RoomType.capacity >= guests)
        .order_by(RoomType.price_per_night)
        .all()
    )
    for room_type in room_types:
        count = counts.get(room_type.id, 0)
        if count == 0:
            continue
        results.append(
            AvailableRoomType(
                **RoomTypeOut.model_validate(room_type).model_dump(),
                available_rooms=count,
                nights=nights,
                total_price=round(room_type.price_per_night * nights, 2),
            )
        )
    return results
