import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';

import { SnackbarService } from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';
import { fieldErrorKey } from '../../../shared/ui-components/atoms/form-validation/field-error-keys';
import { LoadingShadeComponent } from '../../../shared/ui-components/atoms/loading-shade/loading-shade.component';

@Component({
  selector: 'app-login',
  imports: [
    FormField,
    TranslocoPipe,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    LoadingShadeComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  userService = inject(UserService);
  private snackbar = inject(SnackbarService);

  readonly credentials = signal({ username: '', password: '' });

  readonly loginForm = form(this.credentials, (path) => {
    validate(path.username, ({ value }) =>
      value().trim() ? undefined : { kind: 'required' },
    );
    validate(path.password, ({ value }) =>
      value().trim() ? undefined : { kind: 'required' },
    );
  });

  hide = signal(true);

  protected readonly errorKey = fieldErrorKey;

  login(event: Event): void {
    event.preventDefault();
    if (this.userService.isLoading()) {
      return;
    }
    if (this.loginForm().invalid()) {
      this.loginForm().markAsTouched();
      return;
    }
    const { username, password } = this.credentials();
    this.userService.signIn(username.trim(), password).subscribe({
      error: () => this.snackbar.error('LOGIN_ERROR'),
    });
  }
}