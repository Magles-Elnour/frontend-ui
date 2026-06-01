import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { PageHeaderComponent } from '../../../../components/page-header/page-header.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Member, MemberStatus } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { finalize } from 'rxjs';
import { UrlsNames } from '../../../../models/shared-models';
import { SnackbarService } from '../../../../services/snackbar.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormValidationComponent } from '../../../../components/form-validation/form-validation.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-members-form',
  imports: [
    PageHeaderComponent,
    MatProgressSpinner,
    TranslocoPipe,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
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
  member: Member = { status: MemberStatus.ACTIVE };
  statuses = Object.values(MemberStatus);
  loading = signal(false);
  isEditMode = false;

  constructor() {
    const memberId = this.route.snapshot.paramMap.get('id');
    if (memberId) {
      this.isEditMode = true;
      this.loading.set(true);
      this.membersService
        .getById(Number(memberId))
        .pipe(finalize(() => setTimeout(() => this.loading.set(false), 300)))
        .subscribe((member) => {
          this.member = member;
        });
    }
  }

  addOrUpdate() {
    this.loading.set(true);
    const request = {
      name: this.member.name!,
      phoneNumber: this.member.phoneNumber,
      status: this.member.status,
      startDate: this.member.startDate,
    };

    const operation = this.isEditMode && this.member.id
      ? this.membersService.update(this.member.id, request)
      : this.membersService.create(request);

    operation
      .pipe(finalize(() => setTimeout(() => this.loading.set(false), 300)))
      .subscribe({
        next: () => {
          this.snackbarService.success(
            `${this.isEditMode ? 'MEMBERS_UPDATE_SUCCESS' : 'MEMBERS_ADD_SUCCESS'}`
          );
          this.router.navigate([
            '/',
            UrlsNames.ADMIN,
            UrlsNames.MEMBERS,
            UrlsNames.MEMBERS_LIST,
          ]);
        },
        // Surface failures (e.g. validation 400) instead of silently doing nothing.
        error: () =>
          this.snackbarService.error(
            this.isEditMode ? 'MEMBERS_UPDATE_ERROR' : 'MEMBERS_ADD_ERROR'
          ),
      });
  }
}
