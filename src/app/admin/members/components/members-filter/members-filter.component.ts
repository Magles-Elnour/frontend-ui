import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { MembersService } from '../../services/members.service';
import { Member, MemberStatus } from '../../models/member';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  of,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UrlsNames } from '../../../../models/shared-models';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-members-filter',
  imports: [
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    TranslocoPipe,
    MatIcon,
    NgClass,
    RouterLink,
  ],
  templateUrl: './members-filter.component.html',
  styleUrl: './members-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersFilterComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  membersService = inject(MembersService);
  filterForm = this.fb.group({
    name: new FormControl<string | null>(null),
    status: new FormControl<MemberStatus | null>(null),
  });
  statuses = Object.values(MemberStatus);
  members = signal<Member[]>([]);
  pageNumber = signal(0);
  pageSize = signal(20);
  totalCount = signal(0);
  loading = signal(false);
  urlsNames = UrlsNames;

  applyFilter() {
    this.getMembers();
  }

  /** Whether any filter is currently active (controls visibility of the clear button). */
  hasActiveFilters(): boolean {
    const { name, status } = this.filterForm.value;
    return !!name || !!status;
  }

  /** Resets name + status so the list returns to showing everything. */
  clearFilters() {
    this.filterForm.reset({ name: null, status: null });
  }

  private formSubscription = new Subscription();

  ngOnInit() {
    this.getMembers();
    this.formSubscription.add(
      this.filterForm.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap((filter) => {
            this.loading.set(true);
            this.pageNumber.set(0);
            return this.membersService
              .get(this.buildParams(filter))
              .pipe(
                catchError(() => of({ content: [], number: 0, size: 0, totalElements: 0, totalPages: 0 })),
                finalize(() => setTimeout(() => this.loading.set(false), 300))
              );
          })
        )
        .subscribe((response) => {
          this.members.set(response.content);
          this.totalCount.set(response.totalElements);
        })
    );
  }

  getMembers() {
    this.loading.set(true);
    this.membersService
      .get(this.buildParams(this.filterForm.value))
      .pipe(
        catchError(() => of({ content: [], number: 0, size: 0, totalElements: 0, totalPages: 0 })),
        finalize(() => setTimeout(() => this.loading.set(false), 300))
      )
      .subscribe((response) => {
        this.members.set(response.content);
        this.totalCount.set(response.totalElements);
      });
  }

  buildParams(filter: any): HttpParams {
    let params = new HttpParams()
      .set('page', this.pageNumber().toString())
      .set('size', this.pageSize().toString());

    if (filter.name) {
      params = params.set('name', filter.name);
    }
    if (filter.status) {
      params = params.set('status', filter.status);
    }
    return params;
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  onPageChange(event: any) {
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.getMembers();
  }
}
