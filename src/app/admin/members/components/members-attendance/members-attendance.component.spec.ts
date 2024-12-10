import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersAttendanceComponent } from './members-attendance.component';

describe('MembersAttendanceComponent', () => {
  let component: MembersAttendanceComponent;
  let fixture: ComponentFixture<MembersAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
