import { TestBed } from '@angular/core/testing';

import { ChantingService } from './chanting.service';

describe('ChantingService', () => {
  let service: ChantingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChantingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
