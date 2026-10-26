import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, validate } from '@angular/forms/signals';

import { SnackbarService } from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';
import {
  LoginFormComponent,
  LoginFormModel,
} from '../../../shared/ui-components/templates/login-form/login-form.component';

@Component({
  selector: 'app-login',
  imports: [LoginFormComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  userService = inject(UserService);
  private snackbar = inject(SnackbarService);

  readonly credentials = signal<LoginFormModel>({ username: '', password: '' });

  readonly loginForm = form(this.credentials, (path) => {
    validate(path.username, ({ value }) =>
      value().trim() ? undefined : { kind: 'required' },
    );
    validate(path.password, ({ value }) =>
      value().trim() ? undefined : { kind: 'required' },
    );
  });

  login(): void {
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