import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { PageHeaderComponent } from '../../../../components/page-header/page-header.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { finalize } from 'rxjs';
import { UrlsNames } from '../../../../models/shared-models';
import { SnackbarService } from '../../../../services/snackbar.service';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  MatButtonToggleGroup,
  MatButtonToggle,
} from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormValidationComponent } from '../../../../components/form-validation/form-validation.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-members-form',
  imports: [
    PageHeaderComponent,
    MatProgressSpinner,
    TranslocoPipe,
    MatButtonToggleGroup,
    MatButtonToggle,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormValidationComponent,
    MatButtonModule,
  ],
  templateUrl: './members-form.component.html',
  styleUrl: './members-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersFormComponent {
  private route = inject(ActivatedRoute);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  private membersService = inject(MembersService);
  member = new Member();
  loading = signal(false);
  constructor() {
    const memberId = this.route.snapshot.paramMap.get('id');
    if (memberId) {
      this.loading.set(true);
      this.membersService
        .getbyId(memberId)
        .pipe(finalize(() => setTimeout(() => this.loading.set(false), 1000)))
        .subscribe((member) => {
          console.log(member);

          this.member = member;
        });
    }
  }
  addOrUpdate() {
    this.loading.set(true);
    this.membersService
      .addOrUpdate(this.member)
      .pipe(finalize(() => setTimeout(() => this.loading.set(false), 1000)))
      .subscribe((member) => {
        this.snackbarService.success(
          `${this.member.id ? 'MEMBERS_UPDATE_SUCCESS' : 'MEMBERS_ADD_SUCCESS'}`
        );
        console.log(member);

        this.router.navigate([
          '/',
          UrlsNames.ADMIN,
          UrlsNames.MEMBERS,
          UrlsNames.MEMBERS_LIST,
        ]);
      });
  }
}
