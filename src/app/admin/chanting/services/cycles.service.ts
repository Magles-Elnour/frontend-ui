import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cycle, CycleResponse, CycleWriteRequest } from '../models/cycle';

@Injectable({ providedIn: 'root' })
export class CyclesService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/chanting/cycles';

  get(params: HttpParams): Observable<CycleResponse> {
    return this.http.get<CycleResponse>(this.baseUrl, { params });
  }

  create(request: CycleWriteRequest): Observable<Cycle> {
    return this.http.post<Cycle>(this.baseUrl, request);
  }

  update(id: number, request: CycleWriteRequest): Observable<Cycle> {
    return this.http.put<Cycle>(`${this.baseUrl}/${id}`, request);
  }
}
