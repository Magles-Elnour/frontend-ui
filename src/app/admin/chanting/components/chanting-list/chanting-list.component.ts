import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { form, validate } from '@angular/forms/signals';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { catchError, debounceTime, finalize, of, skip, Subject, switchMap, tap } from 'rxjs';

import { UrlsNames } from '../../../../models/shared-models';
import { LoadingShadeComponent } from '../../../../shared/ui-components/atoms/loading-shade/loading-shade.component';
import { PageHeaderComponent } from '../../../../shared/ui-components/atoms/page-header/page-header.component';
import { EmptyResultComponent } from '../../../../shared/ui-components/templates/empty-result/empty-result.component';
import { InputComponent } from '../../../../shared/ui-components/atoms/input/input.component';
import { Cycle, CycleStatus } from '../../models/cycle';
import { CyclesService } from '../../services/cycles.service';

@Component({
  selector: 'app-chanting-list',
  imports: [
    PageHeaderComponent,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    RouterLink,
    TranslocoPipe,
    LoadingShadeComponent,
    EmptyResultComponent,
    InputComponent,
  ],
  templateUrl: './chanting-list.component.html',
  styleUrl: './chanting-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChantingListComponent {
  urlsNames = UrlsNames;
  readonly CycleStatus = CycleStatus;

  readonly breadcrumbLinks = [
    ['/', UrlsNames.ADMIN, UrlsNames.CHANTING],
    ['/', UrlsNames.ADMIN, UrlsNames.CHANTING, UrlsNames.CHANTING_LIST],
  ];

  private cyclesService = inject(CyclesService);

  cycles = signal<Cycle[]>([]);
  pageNumber = signal(0);
  pageSize = signal(20);
  totalCount = signal(0);
  loading = signal(false);
  readonly searchModel = signal({ number: '' });
  readonly searchForm = form(this.searchModel, (path) => {
    validate(path.number, ({ value }) =>
      /^[0-9]*$/.test(value()) ? undefined : { kind: 'cycleDigits' },
    );
  });
  private readonly reload$ = new Subject<void>();
  private readonly arabicDateFormatter = new Intl.DateTimeFormat('ar-EG-u-nu-arab', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  constructor() {
    this.reload$
      .pipe(
        tap(() => this.loading.set(!this.searchForm().invalid())),
        switchMap(() => {
          if (this.searchForm().invalid()) {
            return of({
              content: this.cycles(),
              number: this.pageNumber(),
              size: this.pageSize(),
              totalElements: this.totalCount(),
              totalPages: Math.ceil(this.totalCount() / this.pageSize()),
            });
          }
          let params = new HttpParams()
            .set('page', this.pageNumber().toString())
            .set('size', this.pageSize().toString());
          const number = this.searchModel().number;
          if (number) {
            params = params.set('number', number);
          }
          return this.cyclesService.get(params).pipe(
            catchError(() =>
              of({ content: [], number: 0, size: 0, totalElements: 0, totalPages: 0 }),
            ),
            finalize(() => setTimeout(() => this.loading.set(false), 300)),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((response) => {
        this.cycles.set(response.content);
        this.totalCount.set(response.totalElements);
      });
    toObservable(this.searchModel)
      .pipe(
        skip(1),
        debounceTime(500),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.pageNumber.set(0);
        if (this.searchForm().invalid()) {
          this.searchForm().markAsTouched();
        }
        this.loadCycles();
      });
    this.loadCycles();
  }

  loadCycles(): void {
    this.reload$.next();
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadCycles();
  }

  formatDate(value: string): string {
    const date = new Date(`${value}T00:00:00`);
    return this.arabicDateFormatter.format(date);
  }
}
