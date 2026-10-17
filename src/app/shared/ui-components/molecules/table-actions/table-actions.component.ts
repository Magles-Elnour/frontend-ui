import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-table-actions',
  imports: [MatButtonModule, MatIcon, RouterLink, TranslocoPipe],
  templateUrl: './table-actions.component.html',
  styleUrl: './table-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableActionsComponent {
  editLink = input.required<readonly unknown[]>();
  showDelete = input(true);
  deleteLabel = input<string>();
  deleteClick = output<void>();
}