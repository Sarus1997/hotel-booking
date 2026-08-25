import type {
  AuthResponse,
  AvailableRoomType,
  Booking,
  DashboardStats,
  Room,
  RoomType,
  User,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const TOKEN_KEY = "hotel_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    let detail = `เกิดข้อผิดพลาด (${response.status})`;
    try {
      const data = await response.json();
      if (typeof data.detail === "string") detail = data.detail;
    } catch {
      // keep default message
    }
    throw new Error(detail);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const api = {
  login(email: string, password: string): Promise<AuthResponse> {
    const body = new URLSearchParams({ username: email, password });
    return request<AuthResponse>("/api/auth/login", { method: "POST", body });
  },
  register(payload: {
    email: string;
    full_name: string;
    phone: string;
    password: string;
  }): Promise<AuthResponse> {
    return request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  me(): Promise<User> {
    return request<User>("/api/auth/me");
  },
  roomTypes(): Promise<RoomType[]> {
    return request<RoomType[]>("/api/room-types");
  },
  search(checkIn: string, checkOut: string, guests: number): Promise<AvailableRoomType[]> {
    const query = new URLSearchParams({
      check_in: checkIn,
      check_out: checkOut,
      guests: String(guests),
    });
    return request<AvailableRoomType[]>(`/api/room-types/search?${query}`);
  },
  createBooking(payload: {
    room_type_id: number;
    check_in: string;
    check_out: string;
    guests: number;
    note: string;
  }): Promise<Booking> {
    return request<Booking>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  myBookings(): Promise<Booking[]> {
    return request<Booking[]>("/api/bookings/me");
  },
  cancelBooking(id: number): Promise<Booking> {
    return request<Booking>(`/api/bookings/${id}/cancel`, { method: "POST" });
  },
  stats(): Promise<DashboardStats> {
    return request<DashboardStats>("/api/admin/stats");
  },
  allBookings(): Promise<Booking[]> {
    return request<Booking[]>("/api/admin/bookings");
  },
  updateBookingStatus(id: number, status: string): Promise<Booking> {
    return request<Booking>(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  allUsers(): Promise<User[]> {
    return request<User[]>("/api/admin/users");
  },
  allRooms(): Promise<Room[]> {
    return request<Room[]>("/api/admin/rooms");
  },
  createRoom(payload: {
    room_number: string;
    floor: number;
    status: string;
    room_type_id: number;
  }): Promise<Room> {
    return request<Room>("/api/admin/rooms", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  deleteRoom(id: number): Promise<void> {
    return request<void>(`/api/admin/rooms/${id}`, { method: "DELETE" });
  },
  createRoomType(payload: Omit<RoomType, "id">): Promise<RoomType> {
    return request<RoomType>("/api/admin/room-types", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
