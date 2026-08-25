from sqlalchemy.orm import Session

from .models import Room, RoomType, User
from .security import hash_password

ROOM_TYPES = [
    {
        "name": "ห้องมาตรฐาน (Standard)",
        "description": "ห้องขนาด 28 ตร.ม. เตียงคู่ พร้อมแอร์ ทีวี และ Wi-Fi ฟรี",
        "capacity": 2,
        "price_per_night": 1200.0,
        "image_url": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
        "rooms": ["101", "102", "103", "104"],
    },
    {
        "name": "ห้องดีลักซ์ (Deluxe)",
        "description": "ห้องขนาด 36 ตร.ม. วิวเมือง เตียง King size พร้อมอ่างอาบน้ำ",
        "capacity": 3,
        "price_per_night": 2200.0,
        "image_url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
        "rooms": ["201", "202", "203"],
    },
    {
        "name": "ห้องสวีท (Suite)",
        "description": "ห้องชุด 60 ตร.ม. แยกห้องนั่งเล่น พร้อมบริการอาหารเช้าสำหรับ 2 ท่าน",
        "capacity": 4,
        "price_per_night": 4500.0,
        "image_url": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
        "rooms": ["301", "302"],
    },
    {
        "name": "ห้องแฟมิลี่ (Family)",
        "description": "ห้องครอบครัว 55 ตร.ม. 2 เตียงใหญ่ เหมาะสำหรับครอบครัว",
        "capacity": 5,
        "price_per_night": 3600.0,
        "image_url": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
        "rooms": ["401", "402"],
    },
]


def seed(db: Session) -> None:
    if not db.query(User).filter(User.email == "admin@hotel.com").first():
        db.add(
            User(
                email="admin@hotel.com",
                full_name="ผู้ดูแลระบบ",
                phone="020000000",
                hashed_password=hash_password("admin1234"),
                role="admin",
            )
        )
    if not db.query(User).filter(User.email == "user@hotel.com").first():
        db.add(
            User(
                email="user@hotel.com",
                full_name="สมชาย ใจดี",
                phone="0812345678",
                hashed_password=hash_password("user1234"),
                role="customer",
            )
        )

    if not db.query(RoomType).count():
        for data in ROOM_TYPES:
            numbers = data.pop("rooms")
            room_type = RoomType(**data)
            db.add(room_type)
            db.flush()
            for number in numbers:
                db.add(
                    Room(
                        room_number=number,
                        floor=int(number[0]),
                        status="available",
                        room_type_id=room_type.id,
                    )
                )
    db.commit()
