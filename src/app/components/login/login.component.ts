import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule } from '@jsverse/transloco';
import { UserService } from '../../services/user.service';
import { FormValidationComponent } from '../form-validation/form-validation.component';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    TranslocoModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    FormValidationComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  userService = inject(UserService);
  private snackbar = inject(SnackbarService);

  credentials: { username?: string; password?: string } = {};
  hide = true;

  login(): void {
    this.userService
      .signIn(this.credentials.username!, this.credentials.password!)
      .subscribe({
        error: () => this.snackbar.error('LOGIN_ERROR'),
      });
  }
}
