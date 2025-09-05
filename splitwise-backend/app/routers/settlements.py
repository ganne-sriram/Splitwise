from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.schemas.settlement import SettlementCreate, SettlementResponse
from app.models.settlement import Settlement
from app.models.user import User
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/settlements", tags=["settlements"])

@router.post("/", response_model=SettlementResponse)
def create_settlement(settlement: SettlementCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    target_user = db.query(User).filter(User.id == settlement.to_user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Target user not found")
    
    db_settlement = Settlement(
        from_user_id=current_user.id,
        to_user_id=settlement.to_user_id,
        amount=settlement.amount,
        description=settlement.description
    )
    db.add(db_settlement)
    db.commit()
    db.refresh(db_settlement)
    
    return db_settlement

@router.get("/", response_model=List[SettlementResponse])
def get_user_settlements(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    settlements = db.query(Settlement).filter(
        (Settlement.from_user_id == current_user.id) | 
        (Settlement.to_user_id == current_user.id)
    ).all()
    return settlements

@router.get("/{settlement_id}", response_model=SettlementResponse)
def get_settlement(settlement_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    settlement = db.query(Settlement).filter(Settlement.id == settlement_id).first()
    if not settlement:
        raise HTTPException(status_code=404, detail="Settlement not found")
    
    if settlement.from_user_id != current_user.id and settlement.to_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this settlement")
    
    return settlement
