import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { finalize } from 'rxjs';

import { UrlsNames } from '../../../../models/shared-models';
import { SnackbarService } from '../../../../services/snackbar.service';
import { InputComponent } from '../../../../shared/ui-components/atoms/input/input.component';
import { LoadingShadeComponent } from '../../../../shared/ui-components/atoms/loading-shade/loading-shade.component';
import { PageHeaderComponent } from '../../../../shared/ui-components/atoms/page-header/page-header.component';
import { SelectOption } from '../../../../shared/ui-components/atoms/select/select-option.model';
import { SelectComponent } from '../../../../shared/ui-components/atoms/select/select.component';
import { Member, MemberStatus } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { validatePhone } from '../../validators/phone.validator';

@Component({
  selector: 'app-members-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    TranslocoPipe,
    PageHeaderComponent,
    InputComponent,
    SelectComponent,
    LoadingShadeComponent,
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

  /** The member loaded in edit mode (keeps id and startDate for the update request). */
  private loadedMember?: Member;

  readonly statusOptions: SelectOption[] = Object.values(MemberStatus).map(
    (status) => ({ value: status, label: `STATUS_${status}` }),
  );

  readonly form = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    phoneNumber: new FormControl<string | null>(null, (control) =>
      validatePhone(control.value),
    ),
    status: new FormControl<MemberStatus | null>(
      MemberStatus.ACTIVE,
      Validators.required,
    ),
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
          this.form.patchValue({
            name: member.name,
            phoneNumber: member.phoneNumber,
            status: member.status,
          });
        });
    }
  }

  addOrUpdate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { name, phoneNumber, status } = this.form.getRawValue();
    const request = {
      name: name!,
      phoneNumber,
      status,
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