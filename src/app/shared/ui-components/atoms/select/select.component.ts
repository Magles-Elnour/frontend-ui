import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';

import { FormValidationComponent } from '../form-validation/form-validation.component';
import { SelectOption } from './select-option.model';

let nextId = 0;

@Component({
  selector: 'app-select',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslocoPipe,
    FormValidationComponent,
  ],
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' },
})
export class SelectComponent {
  control = input.required<UntypedFormControl>();
  options = input.required<SelectOption[]>();
  label = input<string>();
  placeholder = input<string>();
  selectId = input(`app-select-${nextId++}`);
}