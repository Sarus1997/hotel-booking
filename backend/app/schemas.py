from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=255)
    phone: str = ""
    password: str = Field(min_length=6, max_length=128)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    phone: str
    role: str
    points_balance: int
    lifetime_points: int
    discount_credit: float
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class RoomTypeBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = ""
    capacity: int = Field(default=2, ge=1, le=10)
    price_per_night: float = Field(default=0.0, ge=0)
    image_url: str = ""


class RoomTypeCreate(RoomTypeBase):
    pass


class RoomTypeOut(RoomTypeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class RoomBase(BaseModel):
    room_number: str = Field(min_length=1, max_length=16)
    floor: int = Field(default=1, ge=0)
    status: str = "available"
    room_type_id: int


class RoomCreate(RoomBase):
    pass


class RoomOut(RoomBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    room_type: RoomTypeOut


class AvailableRoomType(RoomTypeOut):
    available_rooms: int
    nights: int
    total_price: float


class BookingCreate(BaseModel):
    room_type_id: int
    check_in: date
    check_out: date
    guests: int = Field(default=1, ge=1, le=10)
    note: str = ""


class BookingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    check_in: date
    check_out: date
    guests: int
    total_price: float
    discount_amount: float
    status: str
    note: str
    points_awarded: bool
    created_at: datetime
    room: RoomOut
    user: UserOut


class BookingStatusUpdate(BaseModel):
    status: str


class DashboardStats(BaseModel):
    total_rooms: int
    total_bookings: int
    active_bookings: int
    total_users: int
    revenue: float
    occupancy_rate: float


class RewardOption(BaseModel):
    points: int
    credit: float
    label: str


class RedeemPoints(BaseModel):
    points: int = Field(ge=100)


class LoyaltyOut(BaseModel):
    points_balance: int
    lifetime_points: int
    discount_credit: float
    rewards: list[RewardOption]
