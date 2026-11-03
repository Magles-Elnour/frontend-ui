import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { getTranslocoTestingModule } from '../../../../testing/transloco-testing';

import { MemberStatus } from '../../models/member';
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

  describe('acceptance criteria', () => {
    const http = () => TestBed.inject(HttpTestingController);
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const respond = (
      match: Parameters<HttpTestingController['expectOne']>[0],
      content: unknown[],
      totalElements = content.length,
    ) =>
      http()
        .expectOne(match)
        .flush({
          content,
          number: 0,
          size: 20,
          totalElements,
          totalPages: Math.ceil(totalElements / 20),
        });

    const isMembersRequest =
      (expected: Record<string, string | null>) =>
      (req: { url: string; params: { get(key: string): string | null } }) =>
        req.url === '/api/members' &&
        Object.entries(expected).every(
          ([key, value]) => req.params.get(key) === value,
        );

    it('shows serial number, name, phone, status label and row tools', async () => {
      component.loadMembers();
      respond('/api/members?page=0&size=20', [
        { id: 7, name: 'Ali', phoneNumber: '0100', status: MemberStatus.SUSPENDED },
      ]);
      await fixture.whenStable();

      const cells = Array.from<HTMLElement>(
        fixture.nativeElement.querySelectorAll('tbody tr:first-child td'),
      ).map((cell) => cell.textContent!.replace(/\s+/g, ' ').trim());
      expect(cells[0]).toBe('1');
      expect(cells[1]).toBe('Ali');
      expect(cells[2]).toBe('0100');
      expect(cells[3]).toBe('STATUS_SUSPENDED');
      expect(cells[4]).toContain('border_color');
      expect(cells[4]).toContain('delete');
    });

    it('keeps search and status applied when moving between pages', async () => {
      component.onFilterChange({ name: 'x', status: MemberStatus.SUSPENDED });
      respond(isMembersRequest({ name: 'x', status: 'SUSPENDED', page: '0' }), [], 60);

      component.onPageChange({ pageIndex: 2, pageSize: 20, length: 60 });
      respond(
        isMembersRequest({ name: 'x', status: 'SUSPENDED', page: '2', size: '20' }),
        [],
        60,
      );
      await fixture.whenStable();
    });

    it('returns to the first page when a filter changes', async () => {
      component.onPageChange({ pageIndex: 3, pageSize: 20, length: 100 });
      respond(isMembersRequest({ page: '3' }), [], 100);

      component.onFilterChange({ name: 'x', status: null });
      respond(isMembersRequest({ name: 'x', page: '0' }), []);
      await fixture.whenStable();
    });

    it('drops the status criterion when "الكل" is selected', async () => {
      component.onFilterChange({ name: null, status: null });
      respond(
        (req) =>
          req.url === '/api/members' &&
          !req.params.has('status') &&
          !req.params.has('name'),
        [],
      );
      await fixture.whenStable();
    });

    it('shows the Arabic empty state when nothing matches', async () => {
      component.onFilterChange({ name: 'nobody', status: null });
      respond(isMembersRequest({ name: 'nobody' }), []);
      await sleep(400); // loading shade is released 300ms after the response
      await fixture.whenStable();

      expect(fixture.nativeElement.textContent).toContain('NO_MEMBERS_MATCH');
    });

    it('does not offer the remove action for already removed members', async () => {
      component.loadMembers();
      respond('/api/members?page=0&size=20', [
        { id: 1, name: 'Gone', status: MemberStatus.REMOVED },
      ]);
      await fixture.whenStable();

      const tools: HTMLElement = fixture.nativeElement.querySelector(
        'tbody tr:first-child td:last-child',
      );
      expect(tools.textContent).toContain('border_color');
      expect(tools.textContent).not.toContain('delete');
    });
  });
});