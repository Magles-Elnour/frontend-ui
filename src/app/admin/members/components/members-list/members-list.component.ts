import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpParams } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  catchError,
  filter,
  finalize,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

import { UrlsNames } from '../../../../models/shared-models';
import { SnackbarService } from '../../../../services/snackbar.service';
import { LoadingShadeComponent } from '../../../../shared/ui-components/atoms/loading-shade/loading-shade.component';
import { PageHeaderComponent } from '../../../../shared/ui-components/atoms/page-header/page-header.component';
import {
  ConfirmDeleteComponent,
  ConfirmDeleteData,
} from '../../../../shared/ui-components/templates/confirm-delete/confirm-delete.component';
import { EmptyResultComponent } from '../../../../shared/ui-components/templates/empty-result/empty-result.component';
import { Member, MemberStatus } from '../../models/member';
import { MembersFilterValue } from '../../models/members-filter-value';
import { MembersService } from '../../services/members.service';
import { MembersFilterComponent } from '../members-filter/members-filter.component';

@Component({
  selector: 'app-members-list',
  imports: [
    PageHeaderComponent,
    MembersFilterComponent,
    MatPaginatorModule,
    TranslocoPipe,
    LoadingShadeComponent,
    MatButtonModule,
    MatIcon,
    RouterLink,
    EmptyResultComponent,
  ],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersListComponent {
  urlsNames = UrlsNames;
  readonly MemberStatus = MemberStatus;

  private membersService = inject(MembersService);
  private snackbar = inject(SnackbarService);
  private dialog = inject(MatDialog);

  members = signal<Member[]>([]);
  pageNumber = signal(0);
  pageSize = signal(20);
  totalCount = signal(0);
  loading = signal(false);

  private filterValue: MembersFilterValue = {};
  private reload$ = new Subject<void>();

  constructor() {
    this.reload$
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap(() =>
          this.membersService.get(this.buildParams()).pipe(
            catchError(() =>
              of({ content: [], number: 0, size: 0, totalElements: 0, totalPages: 0 }),
            ),
            finalize(() => setTimeout(() => this.loading.set(false), 300)),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((response) => {
        this.members.set(response.content);
        this.totalCount.set(response.totalElements);
      });

    this.loadMembers();
  }

  loadMembers(): void {
    this.reload$.next();
  }

  onFilterChange(filterValue: MembersFilterValue): void {
    this.filterValue = filterValue;
    this.pageNumber.set(0);
    this.loadMembers();
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadMembers();
  }

  private buildParams(): HttpParams {
    let params = new HttpParams()
      .set('page', this.pageNumber().toString())
      .set('size', this.pageSize().toString());

    if (this.filterValue.name) {
      params = params.set('name', this.filterValue.name);
    }
    if (this.filterValue.status) {
      params = params.set('status', this.filterValue.status);
    }
    return params;
  }

  deleteMember(member: Member): void {
    const id = member.id;
    if (!id) {
      return;
    }
    this.dialog
      .open<ConfirmDeleteComponent, ConfirmDeleteData, boolean>(
        ConfirmDeleteComponent,
        {
          data: {
            message: 'MEMBER_DELETE_CONFIRM',
            params: { name: member.name },
          },
        },
      )
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.membersService.delete(id)),
      )
      .subscribe({
        next: () => {
          this.snackbar.success('MEMBER_DELETE_SUCCESS');
          this.loadMembers();
        },
        error: () => this.snackbar.error('MEMBER_DELETE_ERROR'),
      });
  }
}