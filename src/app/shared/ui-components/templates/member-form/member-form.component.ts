import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

import { InputComponent } from '../../atoms/input/input.component';
import { LoadingShadeComponent } from '../../atoms/loading-shade/loading-shade.component';
import { SelectOption } from '../../atoms/select/select-option.model';
import { SelectComponent } from '../../atoms/select/select.component';

export interface MemberFormControls<S extends string = string> {
  name: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  status: FormControl<S | null>;
}


@Component({
  selector: 'app-member-form',
  imports: [
    ReactiveFormsModule,
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
export class MemberFormComponent<S extends string = string> {
  form = input.required<FormGroup<MemberFormControls<S>>>();
  statusOptions = input.required<SelectOption[]>();
  isEditMode = input(false);
  loading = input(false);
  submitted = output<void>();
}