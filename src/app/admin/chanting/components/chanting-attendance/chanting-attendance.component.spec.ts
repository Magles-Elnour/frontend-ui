import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChantingAttendanceComponent } from './chanting-attendance.component';

describe('ChantingAttendanceComponent', () => {
  let component: ChantingAttendanceComponent;
  let fixture: ComponentFixture<ChantingAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChantingAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChantingAttendanceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
