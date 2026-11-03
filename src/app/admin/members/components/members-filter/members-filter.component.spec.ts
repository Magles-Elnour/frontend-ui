import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { getTranslocoTestingModule } from '../../../../testing/transloco-testing';
import { MemberStatus } from '../../models/member';
import { MembersFilterValue } from '../../models/members-filter-value';

import { MembersFilterComponent } from './members-filter.component';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const AFTER_DEBOUNCE = 650;

describe('MembersFilterComponent', () => {
  let component: MembersFilterComponent;
  let fixture: ComponentFixture<MembersFilterComponent>;
  let emitted: MembersFilterValue[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersFilterComponent, getTranslocoTestingModule()],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersFilterComponent);
    component = fixture.componentInstance;
    emitted = [];
    component.filterChange.subscribe((value) => emitted.push(value));
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('offers every member status in the status filter', () => {
    expect(component.statuses).toEqual([
      MemberStatus.ACTIVE,
      MemberStatus.SUSPENDED,
      MemberStatus.REMOVED,
      MemberStatus.DIED,
    ]);
  });

  it('uses the search label as the search field placeholder', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      'app-search-input input',
    );
    expect(input.placeholder).toBe('SEARCH_NAME');
  });

  it('emits name and status together once the user stops typing', async () => {
    component.filterModel.set({ name: 'أحمد', status: MemberStatus.SUSPENDED });
    await fixture.whenStable();
    expect(emitted).toEqual([]);

    await sleep(AFTER_DEBOUNCE);
    expect(emitted).toEqual([
      { name: 'أحمد', status: MemberStatus.SUSPENDED },
    ]);
  });

  it('emits a null status when "الكل" is selected', async () => {
    component.filterModel.set({ name: '', status: MemberStatus.ACTIVE });
    await fixture.whenStable();
    await sleep(AFTER_DEBOUNCE);

    component.filterModel.set({ name: '', status: null });
    await fixture.whenStable();
    await sleep(AFTER_DEBOUNCE);

    expect(emitted.at(-1)).toEqual({ name: null, status: null });
  });

  it('clears every active filter', async () => {
    component.filterModel.set({ name: 'x', status: MemberStatus.DIED });
    expect(component.hasActiveFilters()).toBeTrue();

    component.clearFilters();
    expect(component.filterModel()).toEqual({ name: '', status: null });
    expect(component.hasActiveFilters()).toBeFalse();
    await fixture.whenStable();
    await sleep(AFTER_DEBOUNCE);
  });
});