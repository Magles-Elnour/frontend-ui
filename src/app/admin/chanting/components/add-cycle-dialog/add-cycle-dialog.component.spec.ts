import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SnackbarService } from '../../../../services/snackbar.service';
import { getTranslocoTestingModule } from '../../../../testing/transloco-testing';
import { AddCycleDialogComponent } from './add-cycle-dialog.component';

describe('AddCycleDialogComponent', () => {
  let fixture: ComponentFixture<AddCycleDialogComponent>;
  let component: AddCycleDialogComponent;
  let http: HttpTestingController;
  let dialogRef: { close: jasmine.Spy };
  let snackbar: jasmine.SpyObj<SnackbarService>;

  beforeEach(async () => {
    dialogRef = { close: jasmine.createSpy('close') };
    snackbar = jasmine.createSpyObj<SnackbarService>('SnackbarService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [AddCycleDialogComponent, getTranslocoTestingModule()],
      providers: [
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: { number: 5 } },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: SnackbarService, useValue: snackbar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCycleDialogComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('requires a cycle number and start date', () => {
    expect(component.model().number).toBe('5');
    expect(component.form().invalid()).toBeTrue();
    expect(fixture.nativeElement.querySelector('.save-button').disabled).toBeTrue();
    const inputs = fixture.nativeElement.querySelectorAll('app-input input');
    const labels = fixture.nativeElement.querySelectorAll('app-input .input-label');
    expect(inputs[1].type).toBe('date');
    expect(labels[0].textContent).toContain('CYCLE_NUMBER');
    expect(inputs[0].getAttribute('aria-label')).toBe('CYCLE_NUMBER');
    expect(labels[1].textContent).toContain('CYCLE_START_DATE');
    expect(inputs[1].getAttribute('aria-label')).toBe('CYCLE_START_DATE');
    expect(fixture.nativeElement.querySelectorAll('app-input mat-label').length).toBe(0);
    expect(fixture.nativeElement.querySelector('[aria-label="OPEN_DATE_PICKER"]')).not.toBeNull();

    component.model.update((model) => ({ ...model, number: '' }));
    component.save();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('CYCLE_NUMBER_REQUIRED');
    expect(fixture.nativeElement.textContent).toContain('CYCLE_DATE_REQUIRED');
    http.expectNone('/api/chanting/cycles');
  });

  it('accepts ASCII digits only, matching the cycles search field', () => {
    component.model.set({ number: '4', startDate: '2026-11-09' });
    expect(component.form().invalid()).toBeFalse();

    component.model.set({ number: '٤', startDate: '2026-11-09' });
    expect(component.form().invalid()).toBeTrue();

    component.model.set({ number: '4a', startDate: '2026-11-09' });
    expect(component.form().invalid()).toBeTrue();

    component.model.set({ number: '0', startDate: '2026-11-09' });
    expect(component.form().invalid()).toBeTrue();

    component.model.set({ number: '99999999999999999999', startDate: '2026-11-09' });
    expect(component.form().invalid()).toBeTrue();

    component.save();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('CYCLE_ADD_DIGITS_ERROR');
  });

  it('creates a cycle and closes after success', () => {
    component.model.set({ number: '4', startDate: '2026-11-09' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.save-button').disabled).toBeFalse();

    component.save();
    http.expectOne({
      method: 'POST',
      url: '/api/chanting/cycles',
    }).flush({
      id: 9,
      number: 4,
      startDate: '2026-11-09',
      status: 'ONGOING',
    });

    expect(snackbar.success).toHaveBeenCalledWith('CYCLE_SAVE_SUCCESS');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('shows an error notification when creation fails', () => {
    component.model.set({ number: '4', startDate: '2026-11-09' });
    component.save();
    http.expectOne('/api/chanting/cycles').flush('failure', {
      status: 500,
      statusText: 'Server Error',
    });

    expect(snackbar.error).toHaveBeenCalledWith('GLOBAL_ERROR');
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('closes without saving from the close (×) and cancel buttons', () => {
    component.model.set({ number: '4', startDate: '2026-11-09' });
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector('.dialog-header button');
    const cancelButton = fixture.nativeElement.querySelectorAll('mat-dialog-actions button')[1];

    closeButton.click();
    cancelButton.click();

    expect(dialogRef.close).toHaveBeenCalledTimes(2);
    expect(dialogRef.close).not.toHaveBeenCalledWith(true);
    http.expectNone('/api/chanting/cycles');
  });

  it('places Save before an outlined Cancel action with the separator above actions', () => {
    const actions = fixture.nativeElement.querySelector('mat-dialog-actions');
    const buttons = actions.querySelectorAll('button');
    const header = fixture.nativeElement.querySelector('.dialog-header');

    expect(buttons[0].textContent).toContain('SAVE');
    expect(buttons[1].textContent).toContain('CANCEL');
    expect(buttons[1].classList.contains('mat-mdc-outlined-button')).toBeTrue();
    expect(getComputedStyle(header).borderBottomWidth).toBe('0px');
    expect(getComputedStyle(actions).borderTopWidth).toBe('1px');
  });
});
