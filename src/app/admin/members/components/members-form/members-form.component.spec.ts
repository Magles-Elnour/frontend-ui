import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersFormComponent } from './members-form.component';

describe('MembersFormComponent', () => {
  let component: MembersFormComponent;
  let fixture: ComponentFixture<MembersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
