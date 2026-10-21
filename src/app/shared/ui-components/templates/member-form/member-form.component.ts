import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

import { InputComponent } from '../../atoms/input/input.component';
import { LoadingShadeComponent } from '../../atoms/loading-shade/loading-shade.component';
import { SelectOption } from '../../atoms/select/select-option.model';
import { SelectComponent } from '../../atoms/select/select.component';

export interface MemberFormModel {
  name: string;
  phoneNumber: string;
  status: string | null;
}

@Component({
  selector: 'app-member-form',
  imports: [
    MatButtonModule,
    MatIcon,
    TranslocoPipe,
    InputComponent,
    SelectComponent,
    LoadingShadeComponent,
  ],
  templateUrl: './member-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberFormComponent {
  form = input.required<FieldTree<MemberFormModel>>();
  statusOptions = input.required<SelectOption[]>();
  isEditMode = input(false);
  loading = input(false);
  submitted = output<void>();

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted.emit();
  }
}