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
    {
        "name": "ห้องซูพีเรีย (Superior)",
        "description": "ห้องขนาด 32 ตร.ม. เตียง Queen size วิวสวน พร้อมมุมนั่งเล่น",
        "capacity": 2,
        "price_per_night": 1600.0,
        "image_url": "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
        "rooms": ["501", "502", "503", "504"],
    },
    {
        "name": "ห้องทวิน (Twin)",
        "description": "ห้องขนาด 30 ตร.ม. เตียงเดี่ยว 2 เตียง เหมาะสำหรับเพื่อนหรือเพื่อนร่วมงาน",
        "capacity": 2,
        "price_per_night": 1400.0,
        "image_url": "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800",
        "rooms": ["505", "506"],
    },
    {
        "name": "ห้องเอ็กเซ็กคูทีฟ (Executive)",
        "description": "ห้องขนาด 40 ตร.ม. ชั้นสูง วิวเมือง พร้อมโต๊ะทำงานและเครื่องชงกาแฟ",
        "capacity": 2,
        "price_per_night": 2800.0,
        "image_url": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
        "rooms": ["601", "602", "603"],
    },
    {
        "name": "ห้องวิวสวน (Garden View)",
        "description": "ห้องขนาด 34 ตร.ม. ระเบียงส่วนตัว มองเห็นสวนเขียวขจี",
        "capacity": 2,
        "price_per_night": 1800.0,
        "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
        "rooms": ["604", "605"],
    },
    {
        "name": "ห้องจูเนียร์สวีท (Junior Suite)",
        "description": "ห้องขนาด 48 ตร.ม. มุมนั่งเล่นแยกสัดส่วน พร้อมอ่างอาบน้ำและฝักบัวเรนชาวเวอร์",
        "capacity": 3,
        "price_per_night": 3200.0,
        "image_url": "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
        "rooms": ["701", "702"],
    },
    {
        "name": "ห้องฮันนีมูน (Honeymoon)",
        "description": "ห้องขนาด 45 ตร.ม. เตียง King size อ่างจากุซซี่ พร้อมชุดของขวัญสำหรับคู่รัก",
        "capacity": 2,
        "price_per_night": 3800.0,
        "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        "rooms": ["703", "704"],
    },
    {
        "name": "พูลวิลล่า (Pool Villa)",
        "description": "วิลล่าขนาด 80 ตร.ม. พร้อมสระว่ายน้ำส่วนตัวและระเบียงกลางแจ้ง",
        "capacity": 4,
        "price_per_night": 6500.0,
        "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        "rooms": ["801", "802"],
    },
    {
        "name": "ห้องสำหรับผู้พิการ (Accessible)",
        "description": "ห้องขนาด 35 ตร.ม. ออกแบบเพื่อรองรับรถเข็น พร้อมราวจับและห้องน้ำกว้างพิเศษ",
        "capacity": 2,
        "price_per_night": 1300.0,
        "image_url": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",
        "rooms": ["105", "106"],
    },
    {
        "name": "ห้องเพนต์เฮาส์ (Penthouse)",
        "description": "ห้องชั้นบนสุด 100 ตร.ม. วิวพาโนรามา พร้อมห้องนั่งเล่นและบาร์ส่วนตัว",
        "capacity": 4,
        "price_per_night": 9500.0,
        "image_url": "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
        "rooms": ["901"],
    },
    {
        "name": "ห้องเพรสิเดนเชียลสวีท (Presidential Suite)",
        "description": "ห้องชุดหรู 120 ตร.ม. 2 ห้องนอน ห้องรับแขก พร้อมบัตเลอร์ส่วนตัวตลอด 24 ชม.",
        "capacity": 6,
        "price_per_night": 12000.0,
        "image_url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        "rooms": ["902"],
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
