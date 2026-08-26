from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from .database import Base, SessionLocal, engine
from .routers import admin, auth, bookings, loyalty, rooms
from .seed import seed


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    migrate_loyalty_columns()
    with SessionLocal() as db:
        seed(db)
    yield


app = FastAPI(title="ระบบจองห้องพักโรงแรม API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(rooms.router)
app.include_router(bookings.router)
app.include_router(loyalty.router)
app.include_router(admin.router)


def migrate_loyalty_columns() -> None:
    user_columns = {column["name"] for column in inspect(engine).get_columns("users")}
    booking_columns = {column["name"] for column in inspect(engine).get_columns("bookings")}
    with engine.begin() as connection:
        for name, definition in (
            ("points_balance", "INTEGER NOT NULL DEFAULT 0"),
            ("lifetime_points", "INTEGER NOT NULL DEFAULT 0"),
            ("discount_credit", "FLOAT NOT NULL DEFAULT 0"),
        ):
            if name not in user_columns:
                connection.execute(text(f"ALTER TABLE users ADD COLUMN {name} {definition}"))
        if "discount_amount" not in booking_columns:
            connection.execute(
                text("ALTER TABLE bookings ADD COLUMN discount_amount FLOAT NOT NULL DEFAULT 0")
            )
        if "points_awarded" not in booking_columns:
            connection.execute(
                text("ALTER TABLE bookings ADD COLUMN points_awarded BOOLEAN NOT NULL DEFAULT 0")
            )


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}
