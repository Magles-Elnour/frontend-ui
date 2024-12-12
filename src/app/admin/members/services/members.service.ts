import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Member, MemberResponse, membersTestData } from '../models/member';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private http = inject(HttpClient);

  constructor() {}

  getbyId(id: string): Observable<Member> {
    return of(membersTestData.content[0]);

    // this.http.get<MemberResponse>(
    //   `/member/${id}`
    // );
  }
  get(params?: string): Observable<MemberResponse> {
    return of(membersTestData);
    // this.http.get<MemberResponse>(`/api/member${params ? '?' + params : ''}`);
  }

  addOrUpdate(member: Member): Observable<Member> {
    return of(member);
    // this.http.post<Member>(`/member`, member);
  }
}
