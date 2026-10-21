import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { form, required, validate } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { finalize } from 'rxjs';

import { UrlsNames } from '../../../../models/shared-models';
import { SnackbarService } from '../../../../services/snackbar.service';
import { PageHeaderComponent } from '../../../../shared/ui-components/atoms/page-header/page-header.component';
import { SelectOption } from '../../../../shared/ui-components/atoms/select/select-option.model';
import {
  MemberFormComponent,
  MemberFormModel,
} from '../../../../shared/ui-components/templates/member-form/member-form.component';
import { Member, MemberStatus } from '../../models/member';
import { MembersService } from '../../services/members.service';

const DEFAULT_PHONE_REGION = 'EG';

@Component({
  selector: 'app-members-form',
  imports: [PageHeaderComponent, MemberFormComponent],
  templateUrl: './members-form.component.html',
  styleUrl: './members-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersFormComponent {
  private route = inject(ActivatedRoute);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  private membersService = inject(MembersService);

  private loadedMember?: Member;

  readonly statusOptions: SelectOption[] = Object.values(MemberStatus).map(
    (status) => ({ value: status, label: `STATUS_${status}` }),
  );

  readonly model = signal<MemberFormModel>({
    name: '',
    phoneNumber: '',
    status: MemberStatus.ACTIVE,
  });

  readonly form = form(this.model, (path) => {
    required(path.name);
    required(path.status);
    validate(path.phoneNumber, ({ value }) => {
      const phone = value();
      if (!phone.trim()) {
        return undefined;
      }
      try {
        return isValidPhoneNumber(phone, DEFAULT_PHONE_REGION)
          ? undefined
          : { kind: 'phone' };
      } catch {
        return { kind: 'phone' };
      }
    });
  });

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
          this.loadedMember = member;
          this.model.set({
            name: member.name ?? '',
            phoneNumber: member.phoneNumber ?? '',
            status: member.status ?? null,
          });
        });
    }
  }

  addOrUpdate() {
    if (this.form().invalid()) {
      this.form().markAsTouched();
      return;
    }

    this.loading.set(true);
    const { name, phoneNumber, status } = this.model();
    const request = {
      name,
      phoneNumber: phoneNumber || null,
      status: status as MemberStatus | null,
      startDate: this.loadedMember?.startDate,
    };

    const id = this.loadedMember?.id;
    const operation =
      this.isEditMode && id
        ? this.membersService.update(id, request)
        : this.membersService.create(request);

    operation
      .pipe(finalize(() => setTimeout(() => this.loading.set(false), 300)))
      .subscribe({
        next: () => {
          this.snackbarService.success(
            `${this.isEditMode ? 'MEMBERS_UPDATE_SUCCESS' : 'MEMBERS_ADD_SUCCESS'}`,
          );
          this.router.navigate([
            '/',
            UrlsNames.ADMIN,
            UrlsNames.MEMBERS,
            UrlsNames.MEMBERS_LIST,
          ]);
        },
        error: () =>
          this.snackbarService.error(
            this.isEditMode ? 'MEMBERS_UPDATE_ERROR' : 'MEMBERS_ADD_ERROR',
          ),
      });
  }
}