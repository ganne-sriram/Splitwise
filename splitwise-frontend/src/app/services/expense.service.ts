import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Expense, ExpenseCreate, ExpenseWithParticipants } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createExpense(expenseData: ExpenseCreate): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}/expenses/`, expenseData);
  }

  getGroupExpenses(groupId: number): Observable<ExpenseWithParticipants[]> {
    return this.http.get<ExpenseWithParticipants[]>(`${this.apiUrl}/expenses/group/${groupId}`);
  }

  getExpense(expenseId: number): Observable<ExpenseWithParticipants> {
    return this.http.get<ExpenseWithParticipants>(`${this.apiUrl}/expenses/${expenseId}`);
  }

  getUserBalances(): Observable<any> {
    return this.http.get(`${this.apiUrl}/expenses/user/balances`);
  }
}
