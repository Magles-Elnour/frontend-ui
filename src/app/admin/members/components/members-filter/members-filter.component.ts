import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-members-filter',
  imports: [
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    TranslocoPipe,
    MatIcon,
  ],
  templateUrl: './members-filter.component.html',
  styleUrl: './members-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersFilterComponent {
  fb = inject(FormBuilder);
  filterForm = this.fb.group({
    name: new FormControl<string | null>(null),
    groupNumber: new FormControl<number | null>(null),
    partNumber: new FormControl<number | null>(null),
    place: new FormControl<boolean | null>(null),
  });
  groups = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  applyFilter() {}
}
