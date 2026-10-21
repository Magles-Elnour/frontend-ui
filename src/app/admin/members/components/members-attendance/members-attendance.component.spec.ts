import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../../../testing/transloco-testing';

import { MembersAttendanceComponent } from './members-attendance.component';

describe('MembersAttendanceComponent', () => {
  let component: MembersAttendanceComponent;
  let fixture: ComponentFixture<MembersAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersAttendanceComponent, getTranslocoTestingModule()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersAttendanceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
