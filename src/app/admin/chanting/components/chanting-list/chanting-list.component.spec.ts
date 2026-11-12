import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { getTranslocoTestingModule } from '../../../../testing/transloco-testing';
import { CycleStatus } from '../../models/cycle';
import { ChantingListComponent } from './chanting-list.component';

describe('ChantingListComponent', () => {
  let component: ChantingListComponent;
  let fixture: ComponentFixture<ChantingListComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChantingListComponent, getTranslocoTestingModule()],
      providers: [
        provideRouter([]),
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChantingListComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/chanting/cycles?page=0&size=20').flush({
      content: [],
      number: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
    });
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('places the add-cycle action after the search field', () => {
    const search = fixture.nativeElement.querySelector('.search-field');
    const addAction = fixture.nativeElement.querySelector('.add-cycle-button');
    const searchInput = search.querySelector('input') as HTMLInputElement;
    const searchIcon = search.querySelector('mat-icon');
    const searchLabel = search.querySelector('.input-label') as HTMLElement;
    const addIcon = addAction.querySelector('mat-icon');

    expect(search.parentElement).toBe(addAction.parentElement);
    expect(search.compareDocumentPosition(addAction) & Node.DOCUMENT_POSITION_FOLLOWING)
      .toBeTruthy();
    expect(searchInput.placeholder).toBe('ENTER_CYCLE_NUMBER');
    expect(searchLabel.textContent).toContain('SEARCH_CYCLE_NUMBER');
    expect(searchInput.getAttribute('aria-label')).toBe('SEARCH_CYCLE_NUMBER');
    expect(search.querySelector('mat-label')).toBeNull();
    expect(searchIcon).toBeNull();
    expect(addIcon).not.toBeNull();
    expect(addAction.textContent).toContain('ADD_CYCLE');
  });

  it('opens the add-cycle dialog and closes it from cancel or close', async () => {
    fixture.nativeElement.querySelector('.add-cycle-button').click();
    fixture.detectChanges();
    await fixture.whenStable();

    let dialog = document.querySelector('mat-dialog-container');
    expect(dialog).not.toBeNull();
    expect(dialog?.querySelector('[mat-dialog-title]')?.textContent).toContain('ADD_CYCLE');
    (dialog?.querySelector('mat-dialog-actions button[mat-dialog-close]') as HTMLButtonElement).click();
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(document.querySelector('mat-dialog-container')).toBeNull();
    http.expectNone((request) =>
      request.method === 'POST' && request.url === '/api/chanting/cycles',
    );

    fixture.nativeElement.querySelector('.add-cycle-button').click();
    fixture.detectChanges();
    await fixture.whenStable();
    dialog = document.querySelector('mat-dialog-container');
    expect(dialog).not.toBeNull();
    (dialog?.querySelector('.dialog-header button') as HTMLButtonElement).click();
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(document.querySelector('mat-dialog-container')).toBeNull();
    http.expectNone((request) =>
      request.method === 'POST' && request.url === '/api/chanting/cycles',
    );

    TestBed.inject(MatDialog).closeAll();
  });

  it('renders cycle numbers, required columns, and Arabic dates in descending order', async () => {
    component.loadCycles();
    http.expectOne('/api/chanting/cycles?page=0&size=20').flush({
      content: [
        {
          id: 1,
          number: 4,
          startDate: '2026-09-04',
          status: CycleStatus.COMPLETED,
        },
        {
          id: 2,
          number: 12,
          startDate: '2026-09-11',
          status: CycleStatus.ONGOING,
        },
      ],
      number: 0,
      size: 20,
      totalElements: 2,
      totalPages: 1,
    });
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent;
    expect(component.cycles().map((cycle) => cycle.number)).toEqual([12, 4]);
    expect(text).toContain('CYCLE_NUMBER');
    expect(text).toContain('CYCLE_NUMBER_VALUE');
    expect(text).toContain('CYCLE_START_DATE');
    expect(text).toContain('STATUS');
    expect(text).toContain('TABLE_TOOLS');
    expect(text).toContain('٤ سبتمبر ٢٠٢٦');
    expect(text).toContain('CYCLE_STATUS_COMPLETED');
  });

  it('opens the add-cycle dialog with the next cycle number', async () => {
    component.loadCycles();
    http.expectOne('/api/chanting/cycles?page=0&size=20').flush({
      content: [{ id: 31, number: 31, startDate: '2026-09-04', status: CycleStatus.ONGOING }],
      number: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
    });
    await fixture.whenStable();

    fixture.nativeElement.querySelector('.add-cycle-button').click();
    fixture.detectChanges();
    await fixture.whenStable();

    const numberInput = document.querySelector(
      'mat-dialog-container app-input input',
    ) as HTMLInputElement;
    expect(numberInput.value).toBe('32');
    TestBed.inject(MatDialog).closeAll();
  });

  it('filters by cycle number immediately', async () => {
    component.searchModel.set({ number: '4' });
    await fixture.whenStable();
    http.expectOne('/api/chanting/cycles?page=0&size=20&number=4').flush({
      content: [{ id: 1, number: 4, startDate: '2026-09-04', status: CycleStatus.COMPLETED }],
      number: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
    });
    await fixture.whenStable();
    expect(component.searchModel().number).toBe('4');
  });

  it('shows the digits validation error for a non-digit value', async () => {
    const input = fixture.nativeElement.querySelector('app-input input') as HTMLInputElement;
    input.value = 'a';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.searchForm().invalid()).toBeTrue();
    expect(fixture.nativeElement.querySelector('app-input').textContent)
      .toContain('CYCLE_DIGITS_ERROR');
  });

  it('clears the search and reloads all cycles', async () => {
    component.searchModel.set({ number: '4' });
    await fixture.whenStable();
    http.expectOne('/api/chanting/cycles?page=0&size=20&number=4').flush({
      content: [],
      number: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
    });

    component.searchModel.set({ number: '' });
    await fixture.whenStable();
    http.expectOne('/api/chanting/cycles?page=0&size=20').flush({
      content: [{ id: 1, number: 1, startDate: '2026-09-04', status: CycleStatus.ONGOING }],
      number: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
    });
    await fixture.whenStable();
    expect(component.searchModel().number).toBe('');
  });

  it('shows the cycles empty state when no cycle matches', async () => {
    component.searchModel.set({ number: '999' });
    await fixture.whenStable();
    http.expectOne('/api/chanting/cycles?page=0&size=20&number=999').flush({
      content: [],
      number: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
    });
    await new Promise((resolve) => setTimeout(resolve, 400));
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('NO_CYCLES_MATCH');
  });
});
