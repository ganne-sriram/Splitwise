from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database.database import get_db
from app.schemas.group import GroupCreate, GroupResponse, GroupWithMembers
from app.models.group import Group, GroupMember
from app.models.user import User
from app.models.expense import Expense, ExpenseParticipant
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/groups", tags=["groups"])

@router.post("/", response_model=GroupResponse)
def create_group(group: GroupCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_group = Group(
        name=group.name,
        description=group.description,
        created_by=current_user.id
    )
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    
    db_member = GroupMember(group_id=db_group.id, user_id=current_user.id)
    db.add(db_member)
    db.commit()
    
    return db_group

@router.get("/", response_model=List[GroupResponse])
def get_user_groups(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    groups = db.query(Group).join(GroupMember).filter(GroupMember.user_id == current_user.id).all()
    return groups

@router.get("/{group_id}", response_model=GroupWithMembers)
def get_group(group_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")
    
    return group

@router.post("/{group_id}/members/{user_id}")
def add_group_member(group_id: int, user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")
    
    user_to_add = db.query(User).filter(User.id == user_id).first()
    if not user_to_add:
        raise HTTPException(status_code=404, detail="User not found")
    
    existing_membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == user_id
    ).first()
    if existing_membership:
        raise HTTPException(status_code=400, detail="User is already a member")
    
    db_member = GroupMember(group_id=group_id, user_id=user_id)
    db.add(db_member)
    db.commit()
    
    return {"message": "Member added successfully"}

@router.delete("/{group_id}/members/{user_id}")
def remove_group_member(group_id: int, user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")
    
    member_to_remove = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == user_id
    ).first()
    if not member_to_remove:
        raise HTTPException(status_code=404, detail="Member not found")
    
    db.delete(member_to_remove)
    db.commit()
    
    return {"message": "Member removed successfully"}

@router.get("/{group_id}/balances")
def get_group_balances(group_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")
    
    members = db.query(GroupMember).filter(GroupMember.group_id == group_id).all()
    member_ids = [m.user_id for m in members]
    
    paid_by_user = {}
    for user_id in member_ids:
        total_paid = db.query(func.sum(Expense.amount)).filter(
            Expense.group_id == group_id,
            Expense.payer_id == user_id
        ).scalar() or 0
        paid_by_user[user_id] = total_paid
    
    owes_by_user = {}
    for user_id in member_ids:
        total_owes = db.query(func.sum(ExpenseParticipant.amount_owed)).join(
            Expense, ExpenseParticipant.expense_id == Expense.id
        ).filter(
            Expense.group_id == group_id,
            ExpenseParticipant.user_id == user_id
        ).scalar() or 0
        owes_by_user[user_id] = total_owes
    
    net_balances = {}
    for user_id in member_ids:
        net_balances[user_id] = paid_by_user[user_id] - owes_by_user[user_id]
    
    users = db.query(User).filter(User.id.in_(member_ids)).all()
    user_map = {u.id: u for u in users}
    
    balances = []
    for user_id, net_balance in net_balances.items():
        user = user_map[user_id]
        balances.append({
            "user_id": user_id,
            "user_name": user.name,
            "total_paid": paid_by_user[user_id],
            "total_owes": owes_by_user[user_id],
            "net_balance": net_balance
        })
    
    return {"group_id": group_id, "balances": balances}
