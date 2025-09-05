from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.expense import ExpenseCategory

class ExpenseParticipantCreate(BaseModel):
    user_id: int
    amount_owed: float

class ExpenseBase(BaseModel):
    description: str
    amount: float
    category: ExpenseCategory = ExpenseCategory.OTHER
    group_id: int

class ExpenseCreate(ExpenseBase):
    participants: List[ExpenseParticipantCreate]

class ExpenseResponse(ExpenseBase):
    id: int
    payer_id: int
    date: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

class ExpenseParticipantResponse(BaseModel):
    id: int
    expense_id: int
    user_id: int
    amount_owed: float
    
    class Config:
        from_attributes = True

class ExpenseWithParticipants(ExpenseResponse):
    participants: List[ExpenseParticipantResponse] = []
