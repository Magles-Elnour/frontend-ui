import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';

import { fieldErrorKey } from '../form-validation/field-error-keys';
import { SelectOption } from './select-option.model';

@Component({
  selector: 'app-select',
  imports: [FormField, MatFormFieldModule, MatSelectModule, TranslocoPipe],
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' },
})
export class SelectComponent {
  field = input.required<FieldTree<string | null>>();
  options = input.required<SelectOption[]>();
  label = input<string>();
  placeholder = input<string>();

  protected readonly errorKey = fieldErrorKey;
}