import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-empty-result',
  imports: [MatIcon, TranslocoPipe],
  templateUrl: './empty-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyResultComponent {
  message = input('NO_RESULTS');
  icon = input('search_off');
}