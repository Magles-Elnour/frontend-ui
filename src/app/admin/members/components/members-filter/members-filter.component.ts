import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { debounceTime, skip } from 'rxjs';

import { UrlsNames } from '../../../../models/shared-models';
import { SearchInputComponent } from '../../../../shared/ui-components/molecules/search-input/search-input.component';
import { MemberStatus } from '../../models/member';
import { MembersFilterValue } from '../../models/members-filter-value';

@Component({
  selector: 'app-members-filter',
  imports: [
    MatInputModule,
    MatButtonModule,
    FormField,
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
  readonly filterModel = signal<{ name: string; status: MemberStatus | null }>({
    name: '',
    status: null,
  });
  readonly filterForm = form(this.filterModel);

  statuses = Object.values(MemberStatus);
  urlsNames = UrlsNames;

  filterChange = output<MembersFilterValue>();

  constructor() {
    toObservable(this.filterModel)
      .pipe(skip(1), debounceTime(500), takeUntilDestroyed())
      .subscribe(() => this.emitFilter());
  }

  applyFilter(event: Event) {
    event.preventDefault();
    this.emitFilter();
  }

  hasActiveFilters(): boolean {
    const { name, status } = this.filterModel();
    return !!name || !!status;
  }

  clearFilters() {
    this.filterModel.set({ name: '', status: null });
  }

  private emitFilter() {
    const { name, status } = this.filterModel();
    this.filterChange.emit({ name: name || null, status });
  }
}