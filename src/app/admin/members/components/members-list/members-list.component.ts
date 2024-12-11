import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeaderComponent } from '../../../../components/page-header/page-header.component';
import { MatCardModule } from '@angular/material/card';
import { MembersFilterComponent } from '../members-filter/members-filter.component';

@Component({
  selector: 'app-members-list',
  imports: [PageHeaderComponent, MatCardModule, MembersFilterComponent],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersListComponent {}
