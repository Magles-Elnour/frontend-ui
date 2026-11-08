import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { catchError, finalize, of } from 'rxjs';

import { UrlsNames } from '../../../../models/shared-models';
import { LoadingShadeComponent } from '../../../../shared/ui-components/atoms/loading-shade/loading-shade.component';
import { PageHeaderComponent } from '../../../../shared/ui-components/atoms/page-header/page-header.component';
import { EmptyResultComponent } from '../../../../shared/ui-components/templates/empty-result/empty-result.component';
import { Cycle, CycleStatus } from '../../models/cycle';
import { CyclesService } from '../../services/cycles.service';

@Component({
  selector: 'app-chanting-list',
  imports: [
    PageHeaderComponent,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    RouterLink,
    TranslocoPipe,
    LoadingShadeComponent,
    EmptyResultComponent,
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
  searchNumber = signal('');
  searchError = signal('');

  constructor() {
    this.loadCycles();
  }

  loadCycles(): void {
    this.loading.set(true);
    let params = new HttpParams()
      .set('page', this.pageNumber().toString())
      .set('size', this.pageSize().toString());

    if (!this.searchError() && this.searchNumber()) {
      params = params.set('number', this.searchNumber());
    }

    this.cyclesService
      .get(params)
      .pipe(
        catchError(() =>
          of({ content: [], number: 0, size: 0, totalElements: 0, totalPages: 0 }),
        ),
        finalize(() => setTimeout(() => this.loading.set(false), 300)),
      )
      .subscribe((response) => {
        this.cycles.set(response.content);
        this.totalCount.set(response.totalElements);
      });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchNumber.set(value);
    this.searchError.set(/^\d*$/.test(value) ? '' : 'يرجى إدخال أرقام فقط.');
    this.pageNumber.set(0);
    this.loadCycles();
  }

  clearSearch(input: HTMLInputElement): void {
    input.value = '';
    this.searchNumber.set('');
    this.searchError.set('');
    this.pageNumber.set(0);
    this.loadCycles();
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadCycles();
  }

  formatDate(value: string): string {
    const date = new Date(`${value}T00:00:00`);
    return new Intl.DateTimeFormat('ar-EG-u-nu-arab', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }
}
