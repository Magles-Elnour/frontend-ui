import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { getTranslocoTestingModule } from '../../../../testing/transloco-testing';

import { FormValidationComponent } from './form-validation.component';

describe('FormValidationComponent', () => {
  let component: FormValidationComponent;
  let fixture: ComponentFixture<FormValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormValidationComponent, getTranslocoTestingModule()],
    }).compileComponents();
    fixture = TestBed.createComponent(FormValidationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('element', new FormControl(''));
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders validation changes without manually triggering change detection', async () => {
    const control = new FormControl('', Validators.required);
    fixture.componentRef.setInput('element', control);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('mat-error')).toBeNull();

    control.markAsTouched();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('mat-error').textContent).toContain('REQUIRED');

    control.setValue('valid');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('mat-error')).toBeNull();
  });
});
