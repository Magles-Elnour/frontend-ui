import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Member,
  MemberResponse,
  CreateMemberRequest,
  UpdateMemberRequest,
} from '../models/member';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/members';

  getById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.baseUrl}/${id}`);
  }

  get(params?: HttpParams): Observable<MemberResponse> {
    return this.http.get<MemberResponse>(this.baseUrl, { params });
  }

  create(request: CreateMemberRequest): Observable<Member> {
    return this.http.post<Member>(this.baseUrl, request);
  }

  update(id: number, request: UpdateMemberRequest): Observable<Member> {
    return this.http.put<Member>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
