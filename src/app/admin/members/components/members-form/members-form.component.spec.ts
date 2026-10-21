import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { getTranslocoTestingModule } from '../../../../testing/transloco-testing';

import { MembersFormComponent } from './members-form.component';

describe('MembersFormComponent', () => {
  let component: MembersFormComponent;
  let fixture: ComponentFixture<MembersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersFormComponent, getTranslocoTestingModule()],
      providers: [provideRouter([]), provideHttpClient(withXhr()), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates inputs and submit availability after a programmatic form update', async () => {
    const submit: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submit.disabled).toBeTrue();

    await Promise.resolve().then(() => component.model.update((m) => ({ ...m, name: 'Updated member' })));
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-input input').value).toBe('Updated member');
    expect(submit.disabled).toBeFalse();

    component.model.update((m) => ({ ...m, name: '' }));
    await fixture.whenStable();
    expect(submit.disabled).toBeTrue();
  });
});