import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';

import { fieldErrorKey } from '../form-validation/field-error-keys';

@Component({
  selector: 'app-input',
  imports: [
    FormField,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TranslocoPipe,
  ],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' },
})
export class InputComponent {
  field = input.required<FieldTree<string>>();
  label = input<string>();
  placeholder = input<string>();
  type = input<'text' | 'email' | 'tel' | 'number' | 'password'>('text');
  autocomplete = input<string>();
  prefixIcon = input<string>();
  hideToggle = input(false);
  floatLabel = input<'always' | 'auto'>('auto');

  readonly hidePassword = signal(true);

  protected readonly errorKey = fieldErrorKey;

  protected togglePasswordVisibility(): void {
    this.hidePassword.update((hidden) => !hidden);
  }
}