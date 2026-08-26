from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import LoyaltyOut, RedeemPoints, RewardOption
from ..security import get_current_user

router = APIRouter(prefix="/api/loyalty", tags=["loyalty"])

REWARDS = (
    RewardOption(points=100, credit=100, label="ส่วนลด 100 บาท"),
    RewardOption(points=500, credit=600, label="ส่วนลด 600 บาท"),
    RewardOption(points=1000, credit=1300, label="ส่วนลด 1,300 บาท"),
)


@router.get("/me", response_model=LoyaltyOut)
def loyalty(user: User = Depends(get_current_user)) -> LoyaltyOut:
    return LoyaltyOut(
        points_balance=user.points_balance,
        lifetime_points=user.lifetime_points,
        discount_credit=user.discount_credit,
        rewards=list(REWARDS),
    )


@router.post("/redeem", response_model=LoyaltyOut)
def redeem(
    payload: RedeemPoints,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> LoyaltyOut:
    reward = next((item for item in REWARDS if item.points == payload.points), None)
    if not reward:
        raise HTTPException(status_code=400, detail="เลือกแพ็กเกจคะแนนที่มีให้แลกเท่านั้น")
    if user.points_balance < reward.points:
        raise HTTPException(status_code=400, detail="คะแนนของคุณไม่เพียงพอสำหรับโปรโมชันนี้")
    user.points_balance -= reward.points
    user.discount_credit = round(user.discount_credit + reward.credit, 2)
    db.commit()
    db.refresh(user)
    return loyalty(user)
