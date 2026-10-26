import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';

import { fieldErrorKey } from '../form-validation/field-error-keys';

@Component({
  selector: 'app-input',
  imports: [FormField, MatFormFieldModule, MatInputModule, TranslocoPipe],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' },
})
export class InputComponent {
  field = input.required<FieldTree<string>>();
  label = input<string>();
  placeholder = input<string>();
  type = input<'text' | 'email' | 'tel' | 'number' | 'password'>('text');

  protected readonly errorKey = fieldErrorKey;
}