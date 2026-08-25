import { useEffect, useState } from "react";

import { api } from "../api";
import type { Booking, DashboardStats, Room, RoomType, User } from "../types";
import { STATUS_LABELS, formatBaht, formatDate } from "../utils";

type Tab = "dashboard" | "bookings" | "rooms" | "users";

const TABS: { key: Tab; label: string }[] = [
  { key: "dashboard", label: "ภาพรวม" },
  { key: "bookings", label: "การจองทั้งหมด" },
  { key: "rooms", label: "จัดการห้องพัก" },
  { key: "users", label: "สมาชิก" },
];

export default function Admin() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [newRoom, setNewRoom] = useState({ room_number: "", floor: 1, room_type_id: 0 });

  async function load() {
    setError("");
    try {
      const [statsData, bookingsData, roomsData, roomTypesData, usersData] =
        await Promise.all([
          api.stats(),
          api.allBookings(),
          api.allRooms(),
          api.roomTypes(),
          api.allUsers(),
        ]);
      setStats(statsData);
      setBookings(bookingsData);
      setRooms(roomsData);
      setRoomTypes(roomTypesData);
      setUsers(usersData);
      setNewRoom((prev) => ({
        ...prev,
        room_type_id: prev.room_type_id || (roomTypesData[0]?.id ?? 0),
      }));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function changeStatus(id: number, status: string) {
    try {
      await api.updateBookingStatus(id, status);
      void load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function addRoom(event: React.FormEvent) {
    event.preventDefault();
    try {
      await api.createRoom({ ...newRoom, status: "available" });
      setNewRoom({ room_number: "", floor: 1, room_type_id: roomTypes[0]?.id ?? 0 });
      void load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function removeRoom(id: number) {
    if (!confirm("ต้องการลบห้องนี้ใช่หรือไม่?")) return;
    try {
      await api.deleteRoom(id);
      void load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="page">
      <h2>แผงควบคุมผู้ดูแลระบบ</h2>
      <nav className="tabs">
        {TABS.map((item) => (
          <button
            key={item.key}
            className={tab === item.key ? "tab active" : "tab"}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      {error && <p className="alert error">{error}</p>}

      {tab === "dashboard" && stats && (
        <div className="stat-grid">
          <div className="stat">
            <span>ห้องพักทั้งหมด</span>
            <strong>{stats.total_rooms}</strong>
          </div>
          <div className="stat">
            <span>การจองทั้งหมด</span>
            <strong>{stats.total_bookings}</strong>
          </div>
          <div className="stat">
            <span>การจองที่ใช้งานอยู่</span>
            <strong>{stats.active_bookings}</strong>
          </div>
          <div className="stat">
            <span>สมาชิก</span>
            <strong>{stats.total_users}</strong>
          </div>
          <div className="stat">
            <span>รายได้รวม</span>
            <strong>{formatBaht(stats.revenue)}</strong>
          </div>
          <div className="stat">
            <span>อัตราเข้าพักวันนี้</span>
            <strong>{stats.occupancy_rate}%</strong>
          </div>
        </div>
      )}

      {tab === "bookings" && (
        <table className="table">
          <thead>
            <tr>
              <th>รหัส</th>
              <th>ลูกค้า</th>
              <th>ห้อง</th>
              <th>วันที่เข้าพัก</th>
              <th>ยอดรวม</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.code}</td>
                <td>
                  {booking.user.full_name}
                  <div className="muted small">{booking.user.email}</div>
                </td>
                <td>
                  {booking.room.room_number}
                  <div className="muted small">{booking.room.room_type.name}</div>
                </td>
                <td>
                  {formatDate(booking.check_in)} – {formatDate(booking.check_out)}
                </td>
                <td>{formatBaht(booking.total_price)}</td>
                <td>
                  <select
                    value={booking.status}
                    onChange={(e) => changeStatus(booking.id, e.target.value)}
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "rooms" && (
        <>
          <form className="inline-form" onSubmit={addRoom}>
            <input
              placeholder="เลขห้อง"
              value={newRoom.room_number}
              onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
              required
            />
            <input
              type="number"
              min={0}
              placeholder="ชั้น"
              value={newRoom.floor}
              onChange={(e) => setNewRoom({ ...newRoom, floor: Number(e.target.value) })}
              required
            />
            <select
              value={newRoom.room_type_id}
              onChange={(e) =>
                setNewRoom({ ...newRoom, room_type_id: Number(e.target.value) })
              }
            >
              {roomTypes.map((roomType) => (
                <option key={roomType.id} value={roomType.id}>
                  {roomType.name}
                </option>
              ))}
            </select>
            <button type="submit">เพิ่มห้องพัก</button>
          </form>
          <table className="table">
            <thead>
              <tr>
                <th>เลขห้อง</th>
                <th>ชั้น</th>
                <th>ประเภท</th>
                <th>ราคา/คืน</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.room_number}</td>
                  <td>{room.floor}</td>
                  <td>{room.room_type.name}</td>
                  <td>{formatBaht(room.room_type.price_per_night)}</td>
                  <td>
                    <button className="ghost" onClick={() => removeRoom(room.id)}>
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === "users" && (
        <table className="table">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>อีเมล</th>
              <th>เบอร์โทร</th>
              <th>สิทธิ์</th>
              <th>สมัครเมื่อ</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.phone || "-"}</td>
                <td>{user.role === "admin" ? "ผู้ดูแลระบบ" : "ลูกค้า"}</td>
                <td>{formatDate(user.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
