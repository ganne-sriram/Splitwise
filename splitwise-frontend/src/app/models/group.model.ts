export interface Group {
  id: number;
  name: string;
  description?: string;
  created_by: number;
  created_at: string;
}

export interface GroupCreate {
  name: string;
  description?: string;
}

export interface GroupMember {
  id: number;
  group_id: number;
  user_id: number;
  joined_at: string;
}

export interface GroupWithMembers extends Group {
  members: GroupMember[];
}
