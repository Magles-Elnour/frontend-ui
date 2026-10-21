import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslocoPipe } from '@jsverse/transloco';

export interface ConfirmDeleteData {
  message: string;
  params?: Record<string, unknown>;
  title?: string;
}

@Component({
  selector: 'app-confirm-delete',
  imports: [MatDialogModule, MatButtonModule, TranslocoPipe],
  templateUrl: './confirm-delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteComponent {
  data = inject<ConfirmDeleteData>(MAT_DIALOG_DATA);
}