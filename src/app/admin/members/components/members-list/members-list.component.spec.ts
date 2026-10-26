import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { getTranslocoTestingModule } from '../../../../testing/transloco-testing';

import { MembersListComponent } from './members-list.component';

describe('MembersListComponent', () => {
  let component: MembersListComponent;
  let fixture: ComponentFixture<MembersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersListComponent, getTranslocoTestingModule()],
      providers: [provideRouter([]), provideHttpClient(withXhr()), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersListComponent);
    component = fixture.componentInstance;
    TestBed.inject(HttpTestingController)
      .expectOne('/api/members?page=0&size=20')
      .flush({ content: [], number: 0, size: 20, totalElements: 0, totalPages: 0 });
    await fixture.whenStable();
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders members returned after the initial view is ready', async () => {
    component.loadMembers();
    await Promise.resolve().then(() =>
      TestBed.inject(HttpTestingController)
        .expectOne('/api/members?page=0&size=20')
        .flush({
          content: [{ id: 1, name: 'Async member', status: 'ACTIVE' }],
          number: 0,
          size: 20,
          totalElements: 1,
          totalPages: 1,
        }),
    );
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('Async member');
  });
});
