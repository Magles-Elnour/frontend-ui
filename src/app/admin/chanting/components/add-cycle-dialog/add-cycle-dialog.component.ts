import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { form, validate } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';

import { SnackbarService } from '../../../../services/snackbar.service';
import { InputComponent } from '../../../../shared/ui-components/atoms/input/input.component';
import { CyclesService } from '../../services/cycles.service';

@Component({
  selector: 'app-add-cycle-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslocoPipe,
    InputComponent,
  ],
  templateUrl: './add-cycle-dialog.component.html',
  styleUrl: './add-cycle-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCycleDialogComponent {
  private readonly data = inject<{ number: number }>(MAT_DIALOG_DATA);
  private readonly cyclesService = inject(CyclesService);
  private readonly dialogRef = inject(MatDialogRef<AddCycleDialogComponent>);
  private readonly snackbar = inject(SnackbarService);

  readonly model = signal({ number: String(this.data.number), startDate: '' });
  readonly form = form(this.model, (path) => {
    validate(path.number, ({ value }) => {
      const number = value();
      if (!number) return { kind: 'cycleNumberRequired' };
      return /^[0-9]+$/.test(number) ? undefined : { kind: 'cycleAddDigits' };
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
    this.cyclesService.create({ number: Number(number), startDate })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.snackbar.success('CYCLE_SAVE_SUCCESS');
          this.dialogRef.close(true);
        },
        error: () => this.snackbar.error('GLOBAL_ERROR'),
      });
  }
}
