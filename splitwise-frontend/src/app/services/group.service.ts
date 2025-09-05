import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Group, GroupCreate, GroupWithMembers } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createGroup(groupData: GroupCreate): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/groups/`, groupData);
  }

  getUserGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/groups/`);
  }

  getGroup(groupId: number): Observable<GroupWithMembers> {
    return this.http.get<GroupWithMembers>(`${this.apiUrl}/groups/${groupId}`);
  }

  addMember(groupId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/groups/${groupId}/members/${userId}`, {});
  }

  removeMember(groupId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/groups/${groupId}/members/${userId}`);
  }

  getGroupBalances(groupId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/groups/${groupId}/balances`);
  }
}
