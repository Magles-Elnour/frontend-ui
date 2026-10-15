import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';

import { FormValidationComponent } from '../form-validation/form-validation.component';

let nextId = 0;

@Component({
  selector: 'app-input',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoPipe,
    FormValidationComponent,
  ],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' },
})
export class InputComponent {
  control = input.required<UntypedFormControl>();
  label = input<string>();
  placeholder = input<string>();
  type = input<'text' | 'email' | 'tel' | 'number' | 'password'>('text');
  inputId = input(`app-input-${nextId++}`);
}