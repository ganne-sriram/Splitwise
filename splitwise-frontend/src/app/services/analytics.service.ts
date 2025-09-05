import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getExpensesByCategory(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/analytics/expenses/by-category/${groupId}`);
  }

  getExpensesByMember(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/analytics/expenses/by-member/${groupId}`);
  }

  getDashboardData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/dashboard`);
  }
}
