import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';

let nextId = 0;

@Component({
  selector: 'app-search-input',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    TranslocoPipe,
  ],
  templateUrl: './search-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'col', style: 'max-width: 486px' },
})
export class SearchInputComponent {
  control = input.required<UntypedFormControl>();
  label = input.required<string>();
  inputId = input(`app-search-input-${nextId++}`);
}