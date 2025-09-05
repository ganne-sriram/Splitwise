from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict
from app.database.database import get_db
from app.models.expense import Expense, ExpenseCategory
from app.models.group import GroupMember
from app.models.user import User
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/expenses/by-category/{group_id}")
def get_expenses_by_category(group_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")
    
    category_totals = db.query(
        Expense.category,
        func.sum(Expense.amount).label('total')
    ).filter(
        Expense.group_id == group_id
    ).group_by(Expense.category).all()
    
    return [{"category": cat.value, "total": total} for cat, total in category_totals]

@router.get("/expenses/by-member/{group_id}")
def get_expenses_by_member(group_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")
    
    member_totals = db.query(
        User.name,
        func.sum(Expense.amount).label('total')
    ).join(
        Expense, User.id == Expense.payer_id
    ).filter(
        Expense.group_id == group_id
    ).group_by(User.id, User.name).all()
    
    return [{"member": name, "total": total} for name, total in member_totals]

@router.get("/dashboard")
def get_dashboard_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    recent_expenses = db.query(Expense).join(GroupMember).filter(
        GroupMember.user_id == current_user.id
    ).order_by(Expense.created_at.desc()).limit(10).all()
    
    user_groups = db.query(GroupMember).filter(GroupMember.user_id == current_user.id).count()
    
    from app.models.expense import ExpenseParticipant
    
    owes = db.query(func.sum(ExpenseParticipant.amount_owed)).filter(
        ExpenseParticipant.user_id == current_user.id
    ).scalar() or 0
    
    paid = db.query(func.sum(Expense.amount)).filter(
        Expense.payer_id == current_user.id
    ).scalar() or 0
    
    net_balance = paid - owes
    
    return {
        "recent_expenses": recent_expenses,
        "total_groups": user_groups,
        "total_owes": owes,
        "total_paid": paid,
        "net_balance": net_balance
    }
