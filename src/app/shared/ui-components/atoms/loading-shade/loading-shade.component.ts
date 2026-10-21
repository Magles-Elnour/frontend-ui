import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-loading-shade',
  imports: [MatProgressSpinner],
  template: `
    @if (show()) {
      <div class="loading-shade">
        <mat-spinner></mat-spinner>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingShadeComponent {
  show = input(false);
}