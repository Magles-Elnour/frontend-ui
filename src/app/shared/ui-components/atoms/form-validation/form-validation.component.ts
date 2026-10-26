import { ChangeDetectorRef, Component, effect, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';

import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-form-validation',
  templateUrl: './form-validation.component.html',
  styleUrls: ['./form-validation.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, TranslocoPipe],
})
export class FormValidationComponent {
  element = input.required<UntypedFormControl>();

  errorMessages: any = {};
  private readonly changeDetector = inject(ChangeDetectorRef);

  constructor() {
    effect((onCleanup) => {
      const subscription = this.element().events.subscribe(() =>
        this.changeDetector.markForCheck(),
      );
      onCleanup(() => subscription.unsubscribe());
    });
  }
}
