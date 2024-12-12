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
import { Member } from '../../models/member';
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
    groupNumber: new FormControl<number | null>(null),
    partNumber: new FormControl<number | null>(null),
    place: new FormControl<boolean | null>(null),
  });
  groups = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  members = signal<Member[]>([]);
  pageNumber = signal(1);
  pageSize = signal(13);
  totalCount = signal(0);
  loading = signal(false);

  applyFilter() {
    this.getMembers();
  }

  private formSubscription = new Subscription();

  ngOnInit() {
    this.getMembers();
    this.formSubscription.add(
      this.filterForm.valueChanges
        .pipe(
          startWith(this.filterForm.value),
          debounceTime(500),
          distinctUntilChanged(),
          switchMap((filter) => {
            this.loading.set(true);
            this.pageNumber.set(1);
            return this.membersService
              .get(this.filterToString(filter))
              .pipe(
                finalize(() => setTimeout(() => this.loading.set(false), 1000))
              );
          })
        )
        .subscribe((members) => {
          this.members.set(members.content);
          this.totalCount.set(members.totalElements);
        })
    );
  }

  getMembers() {
    this.loading.set(true);
    this.membersService
      .get(this.filterToString(this.filterForm.value))
      .pipe(finalize(() => setTimeout(() => this.loading.set(false), 1000)))
      .subscribe((members) => {
        this.members.set(members.content);
        this.totalCount.set(members.totalElements); // Set total count for paginator
      });
  }

  filterToString(filter: any) {
    const params = new URLSearchParams();
    params.set('page', this.pageNumber().toString());
    params.set('size', this.pageSize.toString());
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value.toString());
      }
    });
    return params.toString();
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }
  onPageChange(event: any) {
    this.pageNumber.set(event.pageIndex);

    this.getMembers(); // Fetch members with updated pagination
  }
}
