import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Settlement, SettlementCreate } from '../models/settlement.model';

@Injectable({
  providedIn: 'root'
})
export class SettlementService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createSettlement(settlementData: SettlementCreate): Observable<Settlement> {
    return this.http.post<Settlement>(`${this.apiUrl}/settlements/`, settlementData);
  }

  getUserSettlements(): Observable<Settlement[]> {
    return this.http.get<Settlement[]>(`${this.apiUrl}/settlements/`);
  }

  getSettlement(settlementId: number): Observable<Settlement> {
    return this.http.get<Settlement>(`${this.apiUrl}/settlements/${settlementId}`);
  }
}
