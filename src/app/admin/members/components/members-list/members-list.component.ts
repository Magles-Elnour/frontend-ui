import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/ui-components/atoms/page-header/page-header.component';
import { LoadingShadeComponent } from '../../../../shared/ui-components/atoms/loading-shade/loading-shade.component';
import { TableActionsComponent } from '../../../../shared/ui-components/molecules/table-actions/table-actions.component';
import {
  ConfirmDeleteComponent,
  ConfirmDeleteData,
} from '../../../../shared/ui-components/templates/confirm-delete/confirm-delete.component';
import { EmptyResultComponent } from '../../../../shared/ui-components/templates/empty-result/empty-result.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MembersFilterComponent } from '../members-filter/members-filter.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { UrlsNames } from '../../../../models/shared-models';
import { MembersService } from '../../services/members.service';
import { Member, MemberStatus } from '../../models/member';
import { SnackbarService } from '../../../../services/snackbar.service';
import { filter, switchMap } from 'rxjs';

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
    EmptyResultComponent,
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
  private dialog = inject(MatDialog);

  private filter = viewChild.required(MembersFilterComponent);

  
  deleteMember(member: Member): void {
    const id = member.id;
    if (!id) {
      return;
    }
    const message = this.transloco.translate('MEMBER_DELETE_CONFIRM', {
      name: member.name,
    });
    this.dialog
      .open<ConfirmDeleteComponent, ConfirmDeleteData, boolean>(
        ConfirmDeleteComponent,
        { data: { message } },
      )
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.membersService.delete(id)),
      )
      .subscribe({
        next: () => {
          this.snackbar.success('MEMBER_DELETE_SUCCESS');
          this.filter().getMembers();
        },
        error: () => this.snackbar.error('MEMBER_DELETE_ERROR'),
      });
  }
}