import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChantingListComponent } from './chanting-list.component';

describe('ChantingListComponent', () => {
  let component: ChantingListComponent;
  let fixture: ComponentFixture<ChantingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChantingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChantingListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
