import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-chanting-attendance',
  imports: [],
  templateUrl: './chanting-attendance.component.html',
  styleUrl: './chanting-attendance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChantingAttendanceComponent {
  private route = inject(ActivatedRoute);
  selectedCycle = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('cycle'))),
    { initialValue: null },
  );
}
