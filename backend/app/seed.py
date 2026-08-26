from sqlalchemy.orm import Session

from .models import Room, RoomType, User
from .security import hash_password

ROOM_TYPES = [
    {
        "name": "ห้องประหยัด (Economy)",
        "description": "ห้องกะทัดรัด 20 ตร.ม. เหมาะสำหรับผู้เข้าพักคนเดียว พร้อม Wi-Fi ฟรี",
        "capacity": 1,
        "price_per_night": 850.0,
        "image_url": "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
        "rooms": ["001", "002"],
    },
    {
        "name": "ห้องมาตรฐาน (Standard)",
        "description": "ห้องขนาด 28 ตร.ม. เตียงคู่ พร้อมแอร์ ทีวี และ Wi-Fi ฟรี",
        "capacity": 2,
        "price_per_night": 1200.0,
        "image_url": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
        "rooms": ["101", "102", "103", "104"],
    },
    {
        "name": "ห้องซูพีเรียร์ (Superior)",
        "description": "ห้องขนาด 32 ตร.ม. ตกแต่งร่วมสมัย วิวสวน พร้อมโต๊ะทำงานและ Wi-Fi ฟรี",
        "capacity": 2,
        "price_per_night": 1600.0,
        "image_url": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",
        "rooms": ["105", "106", "107"],
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
        "name": "ห้องดีลักซ์วิวทะเล (Ocean Deluxe)",
        "description": "ห้องขนาด 40 ตร.ม. ระเบียงส่วนตัวพร้อมวิวทะเล และมุมพักผ่อนริมหน้าต่าง",
        "capacity": 3,
        "price_per_night": 2800.0,
        "image_url": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
        "rooms": ["204", "205"],
    },
    {
        "name": "ห้องพรีเมียม (Premium)",
        "description": "ห้องขนาด 42 ตร.ม. เตียง King size โซฟานั่งเล่น และเครื่องชงกาแฟส่วนตัว",
        "capacity": 2,
        "price_per_night": 3200.0,
        "image_url": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
        "rooms": ["206", "207"],
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
        "name": "ห้องจูเนียร์สวีท (Junior Suite)",
        "description": "ห้องขนาด 48 ตร.ม. แบ่งพื้นที่นอนและนั่งเล่น พร้อมอ่างอาบน้ำและมินิบาร์",
        "capacity": 3,
        "price_per_night": 3900.0,
        "image_url": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
        "rooms": ["303", "304"],
    },
    {
        "name": "ห้องสวีทวิวเมือง (City Suite)",
        "description": "ห้องชุด 65 ตร.ม. วิวเมืองแบบพาโนรามา พร้อมห้องนั่งเล่นและโต๊ะรับประทานอาหาร",
        "capacity": 4,
        "price_per_night": 5200.0,
        "image_url": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
        "rooms": ["305"],
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
        "name": "ห้องแฟมิลี่คอนเนคติ้ง (Family Connecting)",
        "description": "ห้องพัก 2 ห้องเชื่อมถึงกัน รวม 70 ตร.ม. เป็นส่วนตัวและสะดวกสำหรับครอบครัวใหญ่",
        "capacity": 6,
        "price_per_night": 4800.0,
        "image_url": "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
        "rooms": ["403", "404"],
    },
    {
        "name": "ห้องผู้บริหาร (Executive)",
        "description": "ห้องขนาด 45 ตร.ม. มีโต๊ะทำงาน โซฟา และสิทธิ์เข้า Executive Lounge",
        "capacity": 2,
        "price_per_night": 4200.0,
        "image_url": "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800",
        "rooms": ["405", "406"],
    },
    {
        "name": "พูลวิลล่า (Pool Villa)",
        "description": "วิลล่าส่วนตัว 80 ตร.ม. พร้อมสระว่ายน้ำส่วนตัว ระเบียง และพื้นที่พักผ่อนกลางแจ้ง",
        "capacity": 4,
        "price_per_night": 7500.0,
        "image_url": "https://images.unsplash.com/photo-1582610116397-edb318620f90?w=800",
        "rooms": ["501", "502"],
    },
    {
        "name": "การ์เด้นวิลล่า (Garden Villa)",
        "description": "วิลล่า 75 ตร.ม. รายล้อมด้วยสวนร่มรื่น มีชานพักส่วนตัวและอ่างแช่น้ำกลางแจ้ง",
        "capacity": 4,
        "price_per_night": 6200.0,
        "image_url": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
        "rooms": ["503", "504"],
    },
    {
        "name": "ห้องฮันนีมูน (Honeymoon)",
        "description": "ห้องโรแมนติก 50 ตร.ม. พร้อมเตียงทรงกลม อ่างจากุซซี่ และระเบียงชมพระอาทิตย์ตก",
        "capacity": 2,
        "price_per_night": 5800.0,
        "image_url": "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800",
        "rooms": ["601"],
    },
    {
        "name": "ห้องเพนต์เฮาส์ (Penthouse)",
        "description": "ห้องพักชั้นบนสุด 110 ตร.ม. พร้อมห้องนั่งเล่นกว้าง ระเบียงส่วนตัว และวิวเมืองรอบด้าน",
        "capacity": 4,
        "price_per_night": 9800.0,
        "image_url": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        "rooms": ["701"],
    },
    {
        "name": "ห้องสำหรับผู้ใช้รถเข็น (Accessible)",
        "description": "ห้องขนาด 32 ตร.ม. ออกแบบไร้สิ่งกีดขวาง ห้องน้ำพร้อมราวจับและประตูบานกว้าง",
        "capacity": 2,
        "price_per_night": 1700.0,
        "image_url": "https://images.unsplash.com/photo-1590490359854-dfba19688d70?w=800",
        "rooms": ["108"],
    },
    {
        "name": "ห้องพักระยะยาว (Long Stay)",
        "description": "ห้องขนาด 38 ตร.ม. พร้อมครัวขนาดเล็ก เครื่องซักผ้า และพื้นที่ทำงาน เหมาะกับการพักหลายคืน",
        "capacity": 2,
        "price_per_night": 2400.0,
        "image_url": "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800",
        "rooms": ["208", "209"],
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

    for data in ROOM_TYPES:
        room_type = db.query(RoomType).filter(RoomType.name == data["name"]).first()
        if not room_type:
            room_type = RoomType(
                name=data["name"],
                description=data["description"],
                capacity=data["capacity"],
                price_per_night=data["price_per_night"],
                image_url=data["image_url"],
            )
            db.add(room_type)
            db.flush()

        for number in data["rooms"]:
            if not db.query(Room).filter(Room.room_number == number).first():
                db.add(
                    Room(
                        room_number=number,
                        floor=int(number[0]),
                        status="available",
                        room_type_id=room_type.id,
                    )
                )
    db.commit()
