export enum ExpenseCategory {
  FOOD = 'food',
  TRAVEL = 'travel',
  SHOPPING = 'shopping',
  ENTERTAINMENT = 'entertainment',
  UTILITIES = 'utilities',
  OTHER = 'other'
}

export interface ExpenseParticipant {
  id: number;
  expense_id: number;
  user_id: number;
  amount_owed: number;
}

export interface ExpenseParticipantCreate {
  user_id: number;
  amount_owed: number;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: ExpenseCategory;
  group_id: number;
  payer_id: number;
  date: string;
  created_at: string;
}

export interface ExpenseCreate {
  description: string;
  amount: number;
  category: ExpenseCategory;
  group_id: number;
  participants: ExpenseParticipantCreate[];
}

export interface ExpenseWithParticipants extends Expense {
  participants: ExpenseParticipant[];
}
