import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { PageHeaderComponent } from '../../../../components/page-header/page-header.component';
import { MatCardModule } from '@angular/material/card';
import { MembersFilterComponent } from '../members-filter/members-filter.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { UrlsNames } from '../../../../models/shared-models';
import { MembersService } from '../../services/members.service';
import { Member, MemberStatus } from '../../models/member';
import { SnackbarService } from '../../../../services/snackbar.service';

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
  readonly MemberStatus = MemberStatus;

  private membersService = inject(MembersService);
  private snackbar = inject(SnackbarService);
  private transloco = inject(TranslocoService);

  // Child filter component owns the list data + reload logic.
  private filter = viewChild.required(MembersFilterComponent);

  /**
   * Soft-deletes a member (backend sets status to REMOVED). After confirming, refreshes
   * the list via the filter child so the member drops out of the default view.
   */
  deleteMember(member: Member): void {
    const message = this.transloco.translate('MEMBER_DELETE_CONFIRM', {
      name: member.name,
    });
    if (!member.id || !confirm(message)) {
      return;
    }
    this.membersService.delete(member.id).subscribe({
      next: () => {
        this.snackbar.success('MEMBER_DELETE_SUCCESS');
        this.filter().getMembers();
      },
      error: () => this.snackbar.error('MEMBER_DELETE_ERROR'),
    });
  }
}
