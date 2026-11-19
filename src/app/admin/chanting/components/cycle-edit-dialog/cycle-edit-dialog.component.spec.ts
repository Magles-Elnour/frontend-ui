import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { SnackbarService } from '../../../../services/snackbar.service';
import { getTranslocoTestingModule } from '../../../../testing/transloco-testing';
import { Cycle, CycleStatus } from '../../models/cycle';
import { CyclesService } from '../../services/cycles.service';
import { CycleEditDialogComponent } from './cycle-edit-dialog.component';

describe('CycleEditDialogComponent', () => {
  const cycle: Cycle = {
    id: 12,
    number: 31,
    startDate: '2026-09-04',
    status: CycleStatus.ONGOING,
  };
  let fixture: ComponentFixture<CycleEditDialogComponent>;
  let component: CycleEditDialogComponent;
  let cyclesService: jasmine.SpyObj<CyclesService>;
  let snackbar: jasmine.SpyObj<SnackbarService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<CycleEditDialogComponent, boolean>>;

  beforeEach(async () => {
    cyclesService = jasmine.createSpyObj<CyclesService>('CyclesService', ['update']);
    cyclesService.update.and.returnValue(of(cycle));
    snackbar = jasmine.createSpyObj<SnackbarService>('SnackbarService', [
      'success',
      'error',
    ]);
    dialogRef = jasmine.createSpyObj<
      MatDialogRef<CycleEditDialogComponent, boolean>
    >('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [CycleEditDialogComponent, getTranslocoTestingModule()],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { cycle } },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: CyclesService, useValue: cyclesService },
        { provide: SnackbarService, useValue: snackbar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CycleEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('opens with the edit title and existing cycle information', () => {
    const inputs = fixture.nativeElement.querySelectorAll('app-input input');

    expect(fixture.nativeElement.textContent).toContain('CYCLE_EDIT_TITLE');
    expect(inputs[0].value).toBe('31');
    expect(inputs[1].value).toBe('2026-09-04');
  });

  it('updates the cycle and closes with a success notification', () => {
    component.model.set({ number: '32', startDate: '2026-10-16' });

    component.save();

    expect(cyclesService.update).toHaveBeenCalledWith(12, {
      number: 32,
      startDate: '2026-10-16',
    });
    expect(snackbar.success).toHaveBeenCalledWith('CYCLE_UPDATE_SUCCESS');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('uses the same positive ASCII integer and required-field validation as add', () => {
    component.model.set({ number: '٠', startDate: '' });
    expect(component.form().invalid()).toBeTrue();

    component.model.set({ number: '0', startDate: '2026-10-16' });
    expect(component.form().invalid()).toBeTrue();

    component.model.set({ number: '32', startDate: '' });
    expect(component.form().invalid()).toBeTrue();

    component.model.set({ number: '32', startDate: '2026-10-16' });
    expect(component.form().invalid()).toBeFalse();
  });

  it('does not update when required values are missing', () => {
    component.model.set({ number: '', startDate: '' });

    component.save();

    expect(cyclesService.update).not.toHaveBeenCalled();
  });

  it('shows the backend error message without closing the dialog', () => {
    cyclesService.update.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 500,
            error: { message: 'Cycle update failed on server' },
          }),
      ),
    );

    component.save();

    expect(snackbar.error).toHaveBeenCalledWith(
      'Cycle update failed on server',
    );
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('closes without saving from the close and cancel buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      'mat-dialog-actions button',
    );

    fixture.nativeElement.querySelector('.dialog-header button').click();
    buttons[1].click();

    expect(dialogRef.close).toHaveBeenCalledTimes(2);
    expect(dialogRef.close).not.toHaveBeenCalledWith(true);
    expect(cyclesService.update).not.toHaveBeenCalled();
  });
});
