from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.schemas.expense import ExpenseCreate, ExpenseResponse, ExpenseWithParticipants
from app.models.expense import Expense, ExpenseParticipant
from app.models.group import GroupMember
from app.models.user import User
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/expenses", tags=["expenses"])

@router.post("/", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == expense.group_id,
        GroupMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")
    
    db_expense = Expense(
        description=expense.description,
        amount=expense.amount,
        category=expense.category,
        payer_id=current_user.id,
        group_id=expense.group_id
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    
    for participant in expense.participants:
        db_participant = ExpenseParticipant(
            expense_id=db_expense.id,
            user_id=participant.user_id,
            amount_owed=participant.amount_owed
        )
        db.add(db_participant)
    
    db.commit()
    return db_expense

@router.get("/group/{group_id}", response_model=List[ExpenseWithParticipants])
def get_group_expenses(group_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")
    
    expenses = db.query(Expense).filter(Expense.group_id == group_id).all()
    return expenses

@router.get("/{expense_id}", response_model=ExpenseWithParticipants)
def get_expense(expense_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == expense.group_id,
        GroupMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")
    
    return expense

@router.get("/user/balances")
def get_user_balances(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    
    owes = db.query(ExpenseParticipant).filter(ExpenseParticipant.user_id == current_user.id).all()
    total_owes = sum(participant.amount_owed for participant in owes)
    
    paid_expenses = db.query(Expense).filter(Expense.payer_id == current_user.id).all()
    total_paid = sum(expense.amount for expense in paid_expenses)
    
    net_balance = total_paid - total_owes
    
    return {
        "total_owes": total_owes,
        "total_paid": total_paid,
        "net_balance": net_balance
    }
