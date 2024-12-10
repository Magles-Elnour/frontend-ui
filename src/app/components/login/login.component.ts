import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule } from '@jsverse/transloco';
import { UserService } from '../../services/user.service';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormValidationComponent } from '../form-validation/form-validation.component';
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
export class LoginComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  router: Router = inject(Router);
  credentials: {
    email?: string;
    password?: string;
  } = {};
  hide = true;
  // loginForm = new FormGroup({
  //   email: new FormControl('', [Validators.required, Validators.email]),
  //   password: new FormControl('', Validators.required),
  // });
  subscribtion = new Subscription();
  constructor() {}
  ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }
  ngOnInit(): void {}
}
