import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

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
    expect(component.form().invalid()).toBeTrue();
    expect(fixture.nativeElement.querySelector('.save-button').disabled).toBeTrue();

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

    expect(snackbar.error).toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
