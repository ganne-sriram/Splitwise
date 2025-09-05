from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class GroupBase(BaseModel):
    name: str
    description: Optional[str] = None

class GroupCreate(GroupBase):
    pass

class GroupResponse(GroupBase):
    id: int
    created_by: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class GroupMemberResponse(BaseModel):
    id: int
    group_id: int
    user_id: int
    joined_at: datetime
    
    class Config:
        from_attributes = True

class GroupWithMembers(GroupResponse):
    members: List[GroupMemberResponse] = []
