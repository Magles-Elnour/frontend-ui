import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { getTranslocoTestingModule } from '../../../testing/transloco-testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, getTranslocoTestingModule()],
      providers: [provideRouter([]), provideHttpClient(withXhr()), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates template-driven form validity from input events', async () => {
    const submit: HTMLButtonElement = fixture.nativeElement.querySelector('#login-submit-btn');
    expect(submit.disabled).toBeTrue();

    for (const name of ['username', 'password']) {
      const input: HTMLInputElement = fixture.nativeElement.querySelector(`input[name="${name}"]`);
      input.value = 'test-value';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    await fixture.whenStable();

    expect(submit.disabled).toBeFalse();
    expect(component.credentials).toEqual({ username: 'test-value', password: 'test-value' });
  });
});
