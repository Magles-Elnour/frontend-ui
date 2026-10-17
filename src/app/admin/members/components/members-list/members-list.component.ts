import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/ui-components/atoms/page-header/page-header.component';
import { LoadingShadeComponent } from '../../../../shared/ui-components/atoms/loading-shade/loading-shade.component';
import { TableActionsComponent } from '../../../../shared/ui-components/molecules/table-actions/table-actions.component';
import { MatCardModule } from '@angular/material/card';
import { MembersFilterComponent } from '../members-filter/members-filter.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
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
    TranslocoPipe,
    LoadingShadeComponent,
    TableActionsComponent,
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

  private filter = viewChild.required(MembersFilterComponent);

 
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