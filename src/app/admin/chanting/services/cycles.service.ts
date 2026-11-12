import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateCycleRequest, Cycle, CycleResponse } from '../models/cycle';

@Injectable({ providedIn: 'root' })
export class CyclesService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/chanting/cycles';

  get(params: HttpParams): Observable<CycleResponse> {
    return this.http.get<CycleResponse>(this.baseUrl, { params });
  }

  create(request: CreateCycleRequest): Observable<Cycle> {
    return this.http.post<Cycle>(this.baseUrl, request);
  }
}
