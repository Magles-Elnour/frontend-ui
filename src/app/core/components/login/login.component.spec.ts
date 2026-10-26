import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { getTranslocoTestingModule } from '../../../testing/transloco-testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const submitButton = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('#login-submit-btn');
  const passwordInput = (): HTMLInputElement =>
    fixture.nativeElement.querySelector('input[autocomplete="current-password"]');

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

  it('enables submit only when both fields have non-blank values', async () => {
    expect(submitButton().disabled).toBeTrue();

    component.credentials.set({ username: '   ', password: '   ' });
    await fixture.whenStable();
    expect(submitButton().disabled).toBeTrue();

    component.credentials.set({ username: 'user', password: '   ' });
    await fixture.whenStable();
    expect(submitButton().disabled).toBeTrue();

    component.credentials.set({ username: 'user', password: 'secret' });
    await fixture.whenStable();
    expect(submitButton().disabled).toBeFalse();
  });

  it('updates credentials from input events', async () => {
    const username: HTMLInputElement = fixture.nativeElement.querySelector('input[autocomplete="username"]');
    username.value = 'test-user';
    username.dispatchEvent(new Event('input', { bubbles: true }));
    passwordInput().value = 'test-pass';
    passwordInput().dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();

    expect(component.credentials()).toEqual({ username: 'test-user', password: 'test-pass' });
    expect(submitButton().disabled).toBeFalse();
  });

  it('masks the password and toggles it with the eye button', async () => {
    expect(passwordInput().type).toBe('password');

    const eye: HTMLButtonElement = fixture.nativeElement.querySelector('button[matSuffix]');
    eye.click();
    await fixture.whenStable();
    expect(passwordInput().type).toBe('text');

    eye.click();
    await fixture.whenStable();
    expect(passwordInput().type).toBe('password');
  });

  it('disables submit while the login request is processing', async () => {
    component.credentials.set({ username: 'user', password: 'secret' });
    await fixture.whenStable();
    expect(submitButton().disabled).toBeFalse();

    component.userService.isLoading.set(true);
    await fixture.whenStable();
    expect(submitButton().disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('.loading-shade')).toBeTruthy();
  });
});