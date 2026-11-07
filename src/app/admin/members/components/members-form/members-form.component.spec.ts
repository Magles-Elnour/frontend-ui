import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { getTranslocoTestingModule } from '../../../../testing/transloco-testing';
import { SnackbarService } from '../../../../services/snackbar.service';

import { MembersFormComponent } from './members-form.component';

describe('MembersFormComponent', () => {
  let component: MembersFormComponent;
  let fixture: ComponentFixture<MembersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersFormComponent, getTranslocoTestingModule()],
      providers: [
        provideRouter([]),
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersFormComponent);
    component = fixture.componentInstance;
    TestBed.inject(HttpTestingController)
      .expectOne('/api/members/1')
      .flush({
        id: 1,
        name: 'Existing member',
        phoneNumber: '01000000000',
        status: 'ACTIVE',
        startDate: '2026-01-01',
      });
    component.loading.set(false);
    await fixture.whenStable();
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates inputs and submit availability after a programmatic form update', async () => {
    const submit: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(component.isEditMode).toBeTrue();
    expect(component.model().name).toBe('Existing member');
    expect(submit.disabled).toBeFalse();

    await Promise.resolve().then(() => component.model.update((m) => ({ ...m, name: 'Updated member' })));
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-input input').value).toBe('Updated member');
    expect(submit.disabled).toBeFalse();

    component.model.update((m) => ({ ...m, name: '' }));
    await fixture.whenStable();
    expect(submit.disabled).toBeTrue();
  });

  it('disables submit when the optional phone number is invalid', async () => {
    const submit: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');

    component.model.update((m) => ({ ...m, phoneNumber: '123' }));
    await fixture.whenStable();

    expect(submit.disabled).toBeTrue();
  });

  it('submits the edited member and redirects after a successful update', () => {
    const router = TestBed.inject(Router);
    const snackbar = TestBed.inject(SnackbarService);
    const navigateSpy = spyOn(router, 'navigate').and.resolveTo(true);
    const successSpy = spyOn(snackbar, 'success');

    component.model.update((m) => ({
      ...m,
      name: 'Updated member',
      phoneNumber: '01012345678',
    }));

    component.addOrUpdate();

    const request = TestBed.inject(HttpTestingController).expectOne('/api/members/1');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({
      name: 'Updated member',
      phoneNumber: '01012345678',
      status: 'ACTIVE',
      startDate: '2026-01-01',
    });
    request.flush({
      id: 1,
      name: 'Updated member',
      phoneNumber: '01012345678',
      status: 'ACTIVE',
      startDate: '2026-01-01',
    });
    expect(successSpy).toHaveBeenCalledWith('MEMBERS_UPDATE_SUCCESS');
    expect(navigateSpy).toHaveBeenCalledWith(['/', 'admin', 'members', 'list']);
  });

  it('keeps the edit page and shows an error snackbar when update fails', () => {
    const router = TestBed.inject(Router);
    const snackbar = TestBed.inject(SnackbarService);
    const navigateSpy = spyOn(router, 'navigate');
    const errorSpy = spyOn(snackbar, 'error');

    component.model.update((m) => ({ ...m, name: 'Updated member' }));
    component.addOrUpdate();

    const request = TestBed.inject(HttpTestingController).expectOne('/api/members/1');
    expect(request.request.method).toBe('PUT');
    request.flush(
      { message: 'Update failed' },
      { status: 500, statusText: 'Server Error' },
    );

    expect(errorSpy).toHaveBeenCalledWith('MEMBERS_UPDATE_ERROR');
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});