import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeaderComponent } from '../../../../components/page-header/page-header.component';
import { MatCardModule } from '@angular/material/card';
import { MembersFilterComponent } from '../members-filter/members-filter.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { UrlsNames } from '../../../../models/shared-models';

@Component({
  selector: 'app-members-list',
  imports: [
    PageHeaderComponent,
    MatCardModule,
    MembersFilterComponent,
    MatPaginatorModule,
    MatProgressSpinner,
    TranslocoPipe,
    MatIcon,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersListComponent {
  urlsNames = UrlsNames;
}
