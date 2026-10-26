import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';

import { fieldErrorKey } from '../../atoms/form-validation/field-error-keys';
import { LoadingShadeComponent } from '../../atoms/loading-shade/loading-shade.component';

export interface LoginFormModel {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  imports: [
    FormField,
    TranslocoPipe,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    LoadingShadeComponent,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' },
})
export class LoginFormComponent {
  form = input.required<FieldTree<LoginFormModel>>();
  loading = input(false);
  submitted = output<void>();

  hide = signal(true);

  protected readonly errorKey = fieldErrorKey;

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted.emit();
  }
}