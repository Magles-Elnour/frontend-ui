import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, validate } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { finalize } from 'rxjs';

import { SnackbarService } from '../../../../services/snackbar.service';
import { InputComponent } from '../../../../shared/ui-components/atoms/input/input.component';
import { Cycle } from '../../models/cycle';
import { CyclesService } from '../../services/cycles.service';

interface CycleEditDialogData {
  cycle: Cycle;
}

@Component({
  selector: 'app-cycle-edit-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    TranslocoPipe,
    InputComponent,
  ],
  templateUrl: './cycle-edit-dialog.component.html',
  styleUrl: './cycle-edit-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CycleEditDialogComponent {
  readonly cycle = inject<CycleEditDialogData>(MAT_DIALOG_DATA).cycle;
  private readonly dialogRef = inject(MatDialogRef<CycleEditDialogComponent, boolean>);
  private readonly cyclesService = inject(CyclesService);
  private readonly snackbar = inject(SnackbarService);

  readonly model = signal({
    number: String(this.cycle.number),
    startDate: this.cycle.startDate,
  });
  readonly form = form(this.model, (path) => {
    validate(path.number, ({ value }) => {
      const number = value();
      if (!number) return { kind: 'cycleNumberRequired' };
      if (!/^[0-9]+$/.test(number)) return { kind: 'cycleAddDigits' };
      return Number.isSafeInteger(Number(number)) && Number(number) > 0
        ? undefined
        : { kind: 'cycleAddDigits' };
    });
    validate(path.startDate, ({ value }) =>
      value() ? undefined : { kind: 'cycleDateRequired' },
    );
  });
  readonly saving = signal(false);

  save(): void {
    if (this.form().invalid()) {
      this.form().markAsTouched();
      return;
    }

    const { number, startDate } = this.model();
    this.saving.set(true);
    this.cyclesService.update(this.cycle.id, { number: Number(number), startDate })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.snackbar.success('CYCLE_UPDATE_SUCCESS');
          this.dialogRef.close(true);
        },
        error: (error: unknown) =>
          this.snackbar.error(this.backendErrorMessage(error)),
      });
  }

  private backendErrorMessage(error: unknown): string {
    const responseBody: unknown =
      error instanceof HttpErrorResponse ? error.error : null;
    if (typeof responseBody === 'string') {
      return responseBody;
    }
    if (
      typeof responseBody === 'object' &&
      responseBody !== null &&
      'message' in responseBody &&
      typeof responseBody.message === 'string'
    ) {
      return responseBody.message;
    }
    return 'CYCLE_UPDATE_ERROR';
  }
}