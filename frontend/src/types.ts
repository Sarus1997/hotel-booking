export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role: "admin" | "customer";
  points_balance: number;
  lifetime_points: number;
  discount_credit: number;
  created_at: string;
}

export interface RoomType {
  id: number;
  name: string;
  description: string;
  capacity: number;
  price_per_night: number;
  image_url: string;
}

export interface AvailableRoomType extends RoomType {
  available_rooms: number;
  nights: number;
  total_price: number;
  discount_amount: number;
}

export interface Room {
  id: number;
  room_number: string;
  floor: number;
  status: string;
  room_type_id: number;
  room_type: RoomType;
}

export interface Booking {
  id: number;
  code: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: "confirmed" | "checked_in" | "checked_out" | "cancelled";
  note: string;
  created_at: string;
  room: Room;
  user: User;
}

export interface DashboardStats {
  total_rooms: number;
  total_bookings: number;
  active_bookings: number;
  total_users: number;
  revenue: number;
  occupancy_rate: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RewardOption {
  points: number;
  credit: number;
  label: string;
}

export interface Loyalty {
  points_balance: number;
  lifetime_points: number;
  discount_credit: number;
  rewards: RewardOption[];
}
