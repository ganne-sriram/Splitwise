export interface Settlement {
  id: number;
  from_user_id: number;
  to_user_id: number;
  amount: number;
  description?: string;
  settled_at: string;
}

export interface SettlementCreate {
  to_user_id: number;
  amount: number;
  description?: string;
}
