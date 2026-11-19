import { provideHttpClient, withXhr } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CyclesService } from './cycles.service';

describe('CyclesService', () => {
  let service: CyclesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CyclesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends cycle updates to the cycle resource', () => {
    const request = { number: 32, startDate: '2026-10-16' };

    service.update(12, request).subscribe();

    const update = http.expectOne('/api/chanting/cycles/12');
    expect(update.request.method).toBe('PUT');
    expect(update.request.body).toEqual(request);
    update.flush({ id: 12, ...request, status: 'ONGOING' });
  });

  it('creates cycles through the cycle collection', () => {
    const request = { number: 32, startDate: '2026-10-16' };

    service.create(request).subscribe();

    const create = http.expectOne('/api/chanting/cycles');
    expect(create.request.method).toBe('POST');
    expect(create.request.body).toEqual(request);
    create.flush({ id: 12, ...request, status: 'ONGOING' });
  });
});
