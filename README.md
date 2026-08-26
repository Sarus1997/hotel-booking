# ระบบจองห้องพักโรงแรม (Hotel Booking System)

เว็บแอปจองห้องพักโรงแรมแบบ full-stack: React + TypeScript (Vite) ฝั่งหน้าเว็บ และ FastAPI + SQLite ฝั่งเซิร์ฟเวอร์

## ฟีเจอร์

- ค้นหาห้องว่างตามวันเช็คอิน/เช็คเอาท์ และจำนวนผู้เข้าพัก (กันการจองซ้อนทับด้วยการเช็ควันที่ overlap)
- สมัครสมาชิก / เข้าสู่ระบบด้วย JWT
- จองห้อง คำนวณราคารวมตามจำนวนคืน พร้อมรหัสการจอง
- ดูและยกเลิกการจองของตัวเอง
- ระบบสมาชิกสะสมคะแนน: รับ 1 คะแนนต่อยอดจองสุทธิทุก 100 บาทเมื่อเช็คเอาท์ และแลกเป็นเครดิตส่วนลดได้
- แผงผู้ดูแลระบบ: สถิติภาพรวม, จัดการสถานะการจอง, เพิ่ม/ลบห้องพัก, รายชื่อสมาชิก
- ข้อมูลห้องพัก 18 รูปแบบ รวม 36 ห้อง เช่น Standard, Suite, Villa, Penthouse และ Accessible
- หน้าแยกสำหรับบริการของโรงแรมและข้อมูลติดต่อ
- Responsive layout พร้อม mobile sidebar, animation, loading skeleton และ spinner
- Dark Mode เป็นค่าเริ่มต้น และสลับ Light Mode ได้
- สลับภาษาไทย/อังกฤษได้ โดยจดจำค่าที่เลือกไว้ในเบราว์เซอร์

### สิทธิประโยชน์สมาชิก

สมาชิกแลกคะแนนเป็นเครดิตส่วนลดสำหรับการจองครั้งถัดไปได้จากหน้า “การจองของฉัน”:

| คะแนนที่ใช้ | เครดิตส่วนลด |
| ---: | ---: |
| 100 | 100 บาท |
| 500 | 600 บาท |
| 1,000 | 1,300 บาท |

เครดิตส่วนลดจะถูกใช้โดยอัตโนมัติในการจองครั้งถัดไป และคะแนนจะได้รับเมื่อผู้ดูแลเปลี่ยนสถานะการจองเป็น “เช็คเอาท์แล้ว”

## บัญชีทดสอบ

| บทบาท | อีเมล | รหัสผ่าน |
| --- | --- | --- |
| ผู้ดูแลระบบ | admin@hotel.com | admin1234 |
| ลูกค้า | user@hotel.com | user1234 |

## การติดตั้งและรัน

### Backend (พอร์ต 8000)

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8000
```

ฐานข้อมูล SQLite (`backend/hotel.db`) และข้อมูลตัวอย่าง (ประเภทห้อง 18 แบบ, ห้อง 36 ห้อง, ผู้ใช้ทดสอบ) จะถูกสร้างอัตโนมัติเมื่อเริ่มเซิร์ฟเวอร์ครั้งแรก การ seed สามารถทำงานซ้ำได้โดยไม่ลบข้อมูลเดิม
เอกสาร API อยู่ที่ http://localhost:8000/docs

### Frontend (พอร์ต 5173)

```bash
cd frontend
npm install
npm run dev
```

ตั้งค่า URL ของ API ได้ผ่านตัวแปรแวดล้อม `VITE_API_URL` (ค่าเริ่มต้น `http://localhost:8000`)

### คำสั่งตรวจสอบ Frontend

```bash
cd frontend
npm run build
```

คำสั่งนี้จะตรวจ TypeScript และสร้าง production bundle ด้วย Vite

## โครงสร้างโปรเจกต์

```
backend/app/
  main.py          # สร้างแอป FastAPI, CORS, สร้างตาราง + seed ข้อมูล
  models.py        # ตาราง users, room_types, rooms, bookings
  schemas.py       # Pydantic schemas
  security.py      # แฮชรหัสผ่าน (bcrypt) และ JWT
  availability.py  # ตรรกะห้องว่าง/วันที่ทับซ้อน
  seed.py          # ข้อมูลตัวอย่างห้องพัก 18 ประเภท และผู้ใช้ทดสอบ
  routers/         # auth, rooms, bookings, loyalty, admin
frontend/src/
  api.ts           # client เรียก REST API
  AuthContext.tsx  # จัดการ token และผู้ใช้ปัจจุบัน
  PreferencesContext.tsx # จัดการธีมและภาษา
  roomTranslations.ts    # คำแปลข้อมูลประเภทห้อง
  components/            # Navbar, Footer, HeroSearch, RoomCard, BookingModal
  pages/                 # Home, Login, Register, MyBookings, Services, Contact, Admin
  assets/logo-sr.png     # โลโก้ที่ใช้ใน Footer
```

## หมายเหตุด้านความปลอดภัย

ค่า `HOTEL_SECRET_KEY` เป็นค่าเริ่มต้นสำหรับการพัฒนาเท่านั้น ควรตั้งเป็นค่าลับจริงผ่านตัวแปรแวดล้อมก่อนใช้งานจริง
