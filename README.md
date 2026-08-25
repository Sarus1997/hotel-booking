# ระบบจองห้องพักโรงแรม (Hotel Booking System)

เว็บแอปจองห้องพักโรงแรมแบบ full-stack

- **Frontend:** React 19 + TypeScript + Vite + React Router
- **Backend:** FastAPI (Python) + SQLAlchemy 2 + JWT
- **ฐานข้อมูล:** SQLite (ไฟล์เดียว ไม่ต้องติดตั้งเซิร์ฟเวอร์ฐานข้อมูล)

## สารบัญ

- [ฟีเจอร์](#ฟีเจอร์)
- [ความต้องการของระบบ](#ความต้องการของระบบ)
- [เริ่มต้นใช้งานอย่างรวดเร็ว](#เริ่มต้นใช้งานอย่างรวดเร็ว)
- [วิธีใช้งาน Backend](#วิธีใช้งาน-backend)
- [วิธีใช้งาน Frontend](#วิธีใช้งาน-frontend)
- [ฐานข้อมูล](#ฐานข้อมูล)
- [บัญชีทดสอบ](#บัญชีทดสอบ)
- [คู่มือการใช้งานหน้าเว็บ](#คู่มือการใช้งานหน้าเว็บ)
- [รายการ API](#รายการ-api)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [แก้ปัญหาที่พบบ่อย](#แก้ปัญหาที่พบบ่อย)

## ฟีเจอร์

- ค้นหาห้องว่างตามวันเช็คอิน/เช็คเอาท์ และจำนวนผู้เข้าพัก (กันการจองซ้อนทับด้วยการตรวจช่วงวันที่ทับกัน)
- สมัครสมาชิก / เข้าสู่ระบบด้วย JWT (รหัสผ่านเข้ารหัสด้วย bcrypt)
- จองห้อง คำนวณราคารวมตามจำนวนคืน พร้อมออกรหัสการจอง
- ดูและยกเลิกการจองของตัวเอง
- แผงผู้ดูแลระบบ: สถิติภาพรวม, เปลี่ยนสถานะการจอง, เพิ่ม/ลบห้องพัก, ดูรายชื่อสมาชิก

## ความต้องการของระบบ

| เครื่องมือ | เวอร์ชันขั้นต่ำ |
| --- | --- |
| Python | 3.10+ |
| Node.js | 20.19+ หรือ 22+ (แนะนำ 22.12.0 ตามไฟล์ `frontend/.nvmrc`) |
| npm | 10+ |

## เริ่มต้นใช้งานอย่างรวดเร็ว

ต้องเปิด 2 เทอร์มินัล: หนึ่งสำหรับ backend และอีกหนึ่งสำหรับ frontend

```bash
git clone https://github.com/Sarus1997/hotel-booking.git
cd hotel-booking
```

เทอร์มินัลที่ 1 (backend):

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8000
```

เทอร์มินัลที่ 2 (frontend):

```bash
cd frontend
npm install
npm run dev
```

จากนั้นเปิดเบราว์เซอร์ที่ http://localhost:5173

## วิธีใช้งาน Backend

### ติดตั้งและรัน (พอร์ต 8000)

```bash
cd backend
python3 -m venv .venv                          # สร้าง virtual environment
.venv/bin/pip install -r requirements.txt      # ติดตั้ง dependencies
.venv/bin/uvicorn app.main:app --reload --port 8000
```

บน Windows ใช้ `python -m venv .venv` แล้วเรียก `.venv\Scripts\uvicorn app.main:app --reload --port 8000`

เมื่อเริ่มเซิร์ฟเวอร์ครั้งแรก ระบบจะสร้างตารางทั้งหมดและใส่ข้อมูลตัวอย่างให้อัตโนมัติ

### ตรวจสอบว่าเซิร์ฟเวอร์ทำงาน

```bash
curl http://localhost:8000/healthz     # {"status":"ok"}
```

- เอกสาร API แบบโต้ตอบ (Swagger UI): http://localhost:8000/docs
- เอกสารแบบ ReDoc: http://localhost:8000/redoc

### ตัวแปรแวดล้อม

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
| --- | --- | --- |
| `HOTEL_SECRET_KEY` | `dev-secret-change-me` | กุญแจลับสำหรับเซ็น JWT — **ต้องตั้งค่าใหม่ก่อนใช้งานจริง** |

```bash
export HOTEL_SECRET_KEY="ใส่ค่าลับที่สุ่มมา"
```

อายุ token คือ 24 ชั่วโมง (แก้ได้ที่ `ACCESS_TOKEN_EXPIRE_MINUTES` ใน `backend/app/security.py`)

### ทดสอบ API ด้วย curl

```bash
# เข้าสู่ระบบ (ส่งแบบ form-urlencoded ตามมาตรฐาน OAuth2)
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -d "username=user@hotel.com&password=user1234" | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")

# ค้นหาห้องว่าง
curl "http://localhost:8000/api/room-types/search?check_in=2026-09-01&check_out=2026-09-03&guests=2"

# จองห้อง
curl -X POST http://localhost:8000/api/bookings \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"room_type_id":1,"check_in":"2026-09-01","check_out":"2026-09-03","guests":2,"note":""}'
```

## วิธีใช้งาน Frontend

### ติดตั้งและรัน (พอร์ต 5173)

```bash
cd frontend
nvm use          # เลือก Node ตาม .nvmrc (ถ้าใช้ nvm)
npm install
npm run dev      # โหมดพัฒนา พร้อม hot reload
```

### คำสั่งที่ใช้บ่อย

| คำสั่ง | ความหมาย |
| --- | --- |
| `npm run dev` | รันเซิร์ฟเวอร์สำหรับพัฒนา ที่ http://localhost:5173 |
| `npm run build` | ตรวจชนิดข้อมูลด้วย TypeScript แล้ว build ไฟล์ production ลง `dist/` |
| `npm run preview` | ทดลองเปิดไฟล์ที่ build แล้ว |
| `npm run lint` | ตรวจโค้ดด้วย oxlint |

### ตัวแปรแวดล้อม

ค่าเริ่มต้นของ URL API คือ `http://localhost:8000` หากเซิร์ฟเวอร์อยู่ที่อื่น ให้สร้างไฟล์ `frontend/.env`

```
VITE_API_URL=http://192.168.1.10:8000
```

JWT ถูกเก็บใน `localStorage` ภายใต้คีย์ `hotel_token`

## ฐานข้อมูล

ใช้ SQLite เก็บที่ไฟล์ `backend/hotel.db` (ไม่ถูก commit ขึ้น git) สร้างอัตโนมัติเมื่อรัน backend ครั้งแรก

### ตาราง

| ตาราง | คอลัมน์สำคัญ | คำอธิบาย |
| --- | --- | --- |
| `users` | `email` (unique), `full_name`, `phone`, `hashed_password`, `role` | ผู้ใช้ระบบ `role` เป็น `admin` หรือ `customer` |
| `room_types` | `name` (unique), `description`, `capacity`, `price_per_night`, `image_url` | ประเภทห้องพักและราคาต่อคืน |
| `rooms` | `room_number` (unique), `floor`, `status`, `room_type_id` | ห้องจริงแต่ละห้อง อ้างอิงประเภทห้อง |
| `bookings` | `code` (unique), `user_id`, `room_id`, `check_in`, `check_out`, `guests`, `total_price`, `status`, `note` | การจอง สถานะได้แก่ `confirmed`, `checked_in`, `checked_out`, `cancelled` |

ความสัมพันธ์: `room_types` 1—N `rooms` 1—N `bookings` N—1 `users`

### ข้อมูลตัวอย่างที่ใส่ให้อัตโนมัติ

- ประเภทห้อง 4 แบบ: Standard ฿1,200 · Deluxe ฿2,200 · Family ฿3,600 · Suite ฿4,500 ต่อคืน
- ห้องพักรวม 11 ห้อง (101–104, 201–203, 301–302, 401–402)
- ผู้ใช้ทดสอบ 2 บัญชี (ดูหัวข้อถัดไป)

ข้อมูลตัวอย่างอยู่ในไฟล์ `backend/app/seed.py` แก้ไขได้ตามต้องการ

### ตรรกะการกันจองซ้อน

ห้องจะถือว่า "ไม่ว่าง" เมื่อมีการจองสถานะ `confirmed` หรือ `checked_in` ที่ช่วงวันทับกัน คือ `booking.check_in < ที่ขอ.check_out` และ `booking.check_out > ที่ขอ.check_in` (ดู `backend/app/availability.py`) จองได้สูงสุด 30 คืนต่อครั้ง

### รีเซ็ตฐานข้อมูล

ลบไฟล์แล้วเริ่มเซิร์ฟเวอร์ใหม่ ระบบจะสร้างตารางและข้อมูลตัวอย่างให้ใหม่ทั้งหมด

```bash
rm backend/hotel.db
```

### เปิดดูข้อมูลด้วย sqlite3

```bash
sqlite3 backend/hotel.db
sqlite> .tables
sqlite> SELECT code, check_in, check_out, status FROM bookings;
sqlite> .quit
```

### เปลี่ยนไปใช้ PostgreSQL / MySQL

แก้ connection string ใน `backend/app/database.py` เป็นของฐานข้อมูลที่ต้องการ และติดตั้ง driver เพิ่ม เช่น

```python
engine = create_engine("postgresql+psycopg://user:password@localhost:5432/hotel")
```

## บัญชีทดสอบ

| บทบาท | อีเมล | รหัสผ่าน |
| --- | --- | --- |
| ผู้ดูแลระบบ | admin@hotel.com | admin1234 |
| ลูกค้า | user@hotel.com | user1234 |

## คู่มือการใช้งานหน้าเว็บ

### ฝั่งลูกค้า

1. หน้าแรก เลือกวันเช็คอิน/เช็คเอาท์ และจำนวนผู้เข้าพัก แล้วกด **ค้นหาห้องว่าง**
2. ระบบแสดงเฉพาะประเภทห้องที่ยังว่างและรองรับจำนวนผู้เข้าพักได้ พร้อมราคารวมทั้งการเข้าพัก
3. กด **จองเลย** (หากยังไม่ได้เข้าสู่ระบบจะถูกพาไปหน้าเข้าสู่ระบบ) ใส่หมายเหตุถ้าต้องการ แล้วกด **ยืนยันการจอง**
4. ระบบจะแสดงรหัสการจอง เช่น `BKA1B2C3` และตัดจำนวนห้องว่างทันที
5. เมนู **การจองของฉัน** ใช้ดูประวัติและกด **ยกเลิก** ได้เฉพาะรายการที่สถานะยังเป็น "ยืนยันแล้ว"

### ฝั่งผู้ดูแลระบบ

เข้าสู่ระบบด้วยบัญชี admin แล้วเลือกเมนู **ผู้ดูแลระบบ** จะมี 4 แท็บ

- **ภาพรวม** — จำนวนห้อง, จำนวนการจอง, การจองที่ใช้งานอยู่, จำนวนสมาชิก, รายได้รวม, อัตราเข้าพักวันนี้
- **การจองทั้งหมด** — ดูทุกการจองและเปลี่ยนสถานะ (ยืนยันแล้ว / เช็คอินแล้ว / เช็คเอาท์แล้ว / ยกเลิกแล้ว)
- **จัดการห้องพัก** — เพิ่มห้องใหม่ (เลขห้อง, ชั้น, ประเภท) และลบห้องที่ยังไม่มีประวัติการจอง
- **สมาชิก** — รายชื่อผู้ใช้ทั้งหมด

## รายการ API

| Method | Path | สิทธิ์ | คำอธิบาย |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | ทุกคน | สมัครสมาชิก คืน JWT |
| POST | `/api/auth/login` | ทุกคน | เข้าสู่ระบบ (form-urlencoded) คืน JWT |
| GET | `/api/auth/me` | ล็อกอิน | ข้อมูลผู้ใช้ปัจจุบัน |
| GET | `/api/room-types` | ทุกคน | ประเภทห้องทั้งหมด |
| GET | `/api/room-types/search` | ทุกคน | ค้นหาห้องว่างตามช่วงวันที่และจำนวนผู้เข้าพัก |
| POST | `/api/bookings` | ล็อกอิน | สร้างการจอง |
| GET | `/api/bookings/me` | ล็อกอิน | การจองของตนเอง |
| POST | `/api/bookings/{id}/cancel` | เจ้าของ/แอดมิน | ยกเลิกการจอง |
| GET | `/api/admin/stats` | แอดมิน | สถิติภาพรวม |
| GET | `/api/admin/bookings` | แอดมิน | การจองทั้งหมด |
| PATCH | `/api/admin/bookings/{id}` | แอดมิน | เปลี่ยนสถานะการจอง |
| GET | `/api/admin/users` | แอดมิน | รายชื่อสมาชิก |
| GET/POST | `/api/admin/rooms` | แอดมิน | ดู/เพิ่มห้องพัก |
| DELETE | `/api/admin/rooms/{id}` | แอดมิน | ลบห้องพัก |
| POST/PUT | `/api/admin/room-types` | แอดมิน | เพิ่ม/แก้ไขประเภทห้อง |

ทุก endpoint ที่ต้องล็อกอินให้ส่ง header `Authorization: Bearer <token>`

## โครงสร้างโปรเจกต์

```
backend/
  requirements.txt
  app/
    main.py          # สร้างแอป FastAPI, CORS, สร้างตาราง + seed ข้อมูล
    database.py      # engine, session, Base ของ SQLAlchemy
    models.py        # ตาราง users, room_types, rooms, bookings
    schemas.py       # Pydantic schemas สำหรับ request/response
    security.py      # แฮชรหัสผ่าน (bcrypt) และ JWT
    availability.py  # ตรรกะห้องว่าง/วันที่ทับซ้อน
    seed.py          # ข้อมูลตัวอย่างเริ่มต้น
    routers/         # auth.py, rooms.py, bookings.py, admin.py
frontend/
  index.html
  .nvmrc
  src/
    main.tsx         # จุดเริ่มต้น + Router
    App.tsx          # เมนู, เส้นทาง, การป้องกันหน้าเฉพาะสิทธิ์
    api.ts           # client เรียก REST API
    AuthContext.tsx  # จัดการ token และผู้ใช้ปัจจุบัน
    types.ts         # TypeScript types
    utils.ts         # จัดรูปแบบวันที่/สกุลเงิน
    index.css        # สไตล์ทั้งระบบ
    pages/           # Home, Login, Register, MyBookings, Admin
```

## แก้ปัญหาที่พบบ่อย

| อาการ | สาเหตุ/วิธีแก้ |
| --- | --- |
| หน้าเว็บขึ้น "เกิดข้อผิดพลาด" ทุกครั้ง | backend ไม่ได้รัน หรือ `VITE_API_URL` ชี้ผิด ตรวจด้วย `curl http://localhost:8000/healthz` |
| `Cannot find native binding` ตอน `npm run dev` | Node เก่าเกินไป ใช้ Node 20.19+/22 แล้วลบ `node_modules` กับ `package-lock.json` และ `npm install` ใหม่ |
| `Address already in use` | มีโปรเซสใช้พอร์ตอยู่ เปลี่ยนพอร์ตด้วย `--port 8001` หรือปิดโปรเซสเดิม |
| เข้าสู่ระบบไม่ผ่านหลังแก้ `HOTEL_SECRET_KEY` | token เดิมใช้ไม่ได้แล้ว ให้ออกจากระบบแล้วเข้าใหม่ |
| ข้อมูลเพี้ยน/อยากเริ่มใหม่ | ลบ `backend/hotel.db` แล้วรัน backend ใหม่ |

## หมายเหตุด้านความปลอดภัย

โปรเจกต์นี้ตั้งค่า CORS แบบเปิดกว้าง (`allow_origins=["*"]`) และใช้ `HOTEL_SECRET_KEY` ค่าเริ่มต้นเพื่อความสะดวกในการพัฒนา ก่อนนำขึ้นใช้งานจริงควรจำกัด origin ให้เฉพาะโดเมนของคุณ และตั้งค่ากุญแจลับผ่านตัวแปรแวดล้อม
