import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { getTranslocoTestingModule } from '../../../../testing/transloco-testing';

import { MembersFilterComponent } from './members-filter.component';

describe('MembersFilterComponent', () => {
  let component: MembersFilterComponent;
  let fixture: ComponentFixture<MembersFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersFilterComponent, getTranslocoTestingModule()],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersFilterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
