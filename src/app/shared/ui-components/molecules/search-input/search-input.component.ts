import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-search-input',
  imports: [FormField, MatFormFieldModule, MatInputModule, MatIcon, TranslocoPipe],
  templateUrl: './search-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'col', style: 'max-width: 486px' },
})
export class SearchInputComponent {
  field = input.required<FieldTree<string>>();
  label = input.required<string>();
}