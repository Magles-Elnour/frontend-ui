import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { debounceTime } from 'rxjs';

import { UrlsNames } from '../../../../models/shared-models';
import { SearchInputComponent } from '../../../../shared/ui-components/molecules/search-input/search-input.component';
import { MemberStatus } from '../../models/member';
import { MembersFilterValue } from '../../models/members-filter-value';


@Component({
  selector: 'app-members-filter',
  imports: [
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    TranslocoPipe,
    MatIcon,
    RouterLink,
    SearchInputComponent,
  ],
  templateUrl: './members-filter.component.html',
  styleUrl: './members-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersFilterComponent {
  private fb = inject(FormBuilder);

  filterForm = this.fb.group({
    name: new FormControl<string | null>(null),
    status: new FormControl<MemberStatus | null>(null),
  });
  statuses = Object.values(MemberStatus);
  urlsNames = UrlsNames;

  filterChange = output<MembersFilterValue>();

  constructor() {
    this.filterForm.valueChanges
      .pipe(debounceTime(500), takeUntilDestroyed())
      .subscribe((value) => this.filterChange.emit(value));
  }

  applyFilter() {
    this.filterChange.emit(this.filterForm.value);
  }

  hasActiveFilters(): boolean {
    const { name, status } = this.filterForm.value;
    return !!name || !!status;
  }

  clearFilters() {
    this.filterForm.reset({ name: null, status: null });
  }
}