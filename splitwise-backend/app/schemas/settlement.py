from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SettlementBase(BaseModel):
    to_user_id: int
    amount: float
    description: Optional[str] = None

class SettlementCreate(SettlementBase):
    pass

class SettlementResponse(SettlementBase):
    id: int
    from_user_id: int
    settled_at: datetime
    
    class Config:
        from_attributes = True
