import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeaderComponent } from '../../../../components/page-header/page-header.component';

@Component({
  selector: 'app-members-attendance',
  imports: [PageHeaderComponent],
  templateUrl: './members-attendance.component.html',
  styleUrl: './members-attendance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersAttendanceComponent {}
