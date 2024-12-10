import { Component, OnInit, input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-form-validation',
  templateUrl: './form-validation.component.html',
  styleUrls: ['./form-validation.component.scss'],
  standalone: true,
  imports: [NgIf, MatFormFieldModule, TranslocoPipe],
})
export class FormValidationComponent implements OnInit {
  element = input.required<UntypedFormControl>();

  errorMessages: any = {};
  constructor() {}

  ngOnInit(): void {}
}
