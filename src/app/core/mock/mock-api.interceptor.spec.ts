import { HttpClient, HttpParams, HttpRequest, provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Member, MemberResponse, MemberStatus } from '../../admin/members/models/member';
import { MembersService } from '../../admin/members/services/members.service';
import { authInterceptor } from '../../interceptors/auth.interceptor';
import { MOCK_API_ENABLED } from '../auth/auth.config';
import { httpRequestInterceptor } from '../interceptors/http/http-request.interceptor';
import { mockApiInterceptor } from './mock-api.interceptor';
import { MockApiService } from './mock-api.service';

describe('mockApiInterceptor', () => {
  let http: HttpTestingController;
  let client: HttpClient;
  let members: MembersService;

  beforeEach(() => {
    jasmine.clock().install();
    localStorage.removeItem('mock-api-members-v1');
    sessionStorage.removeItem('mock-auth-username');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withXhr(), withInterceptors([
          mockApiInterceptor, authInterceptor, httpRequestInterceptor,
        ])),
        provideHttpClientTesting(),
        { provide: MOCK_API_ENABLED, useValue: true },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ],
    });
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    http.verify();
    localStorage.removeItem('mock-api-members-v1');
    sessionStorage.removeItem('mock-auth-username');
  });

  function setup(enabled = true): void {
    TestBed.overrideProvider(MOCK_API_ENABLED, { useValue: enabled });
    http = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
    members = TestBed.inject(MembersService);
  }

  it('returns paginated sample members without reaching the backend', () => {
    setup();
    let response!: MemberResponse;
    members.get(new HttpParams().set('page', 1).set('size', 3))
      .subscribe((value) => response = value);
    jasmine.clock().tick(150);

    expect(response.number).toBe(1);
    expect(response.size).toBe(3);
    expect(response.totalElements).toBe(8);
    expect(response.totalPages).toBe(3);
    expect(response.content.map((member) => member.id)).toEqual([4, 5, 6]);
    http.expectNone(() => true);
  });

  it('creates the supplied member, retrieves it, and persists it after reload', () => {
    setup();
    let created!: Member;
    const body = { name: 'erte', phoneNumber: '01060604390', status: MemberStatus.ACTIVE };
    members.create(body).subscribe((value) => created = value);
    jasmine.clock().tick(150);
    expect(created).toEqual({ id: 9, ...body, startDate: null });

    let fetched!: Member;
    members.getById(created.id!).subscribe((value) => fetched = value);
    jasmine.clock().tick(150);
    expect(fetched).toEqual(created);

    const reloaded = new MockApiService();
    const url = '/api/members/9';
    expect(reloaded.handle(new HttpRequest('GET', url), new URL(url, 'http://localhost')).body)
      .toEqual(created);
    http.expectNone(() => true);
  });

  it('updates members and applies combined name and status filters', () => {
    setup();
    members.update(1, { name: 'Updated Member', status: MemberStatus.SUSPENDED }).subscribe();
    jasmine.clock().tick(150);
    let response!: MemberResponse;
    members.get(new HttpParams().set('name', 'updated').set('status', MemberStatus.SUSPENDED))
      .subscribe((value) => response = value);
    jasmine.clock().tick(150);

    expect(response.totalElements).toBe(1);
    expect(response.content[0].id).toBe(1);
    expect(response.content[0].name).toBe('Updated Member');
    http.expectNone(() => true);
  });

  it('soft deletes members and includes them only with the removed filter', () => {
    setup();
    members.delete(1).subscribe();
    jasmine.clock().tick(150);
    let response!: MemberResponse;
    members.get().subscribe((value) => response = value);
    jasmine.clock().tick(150);
    expect(response.totalElements).toBe(7);
    expect(response.content.some((member) => member.id === 1)).toBeFalse();

    members.get(new HttpParams().set('status', MemberStatus.REMOVED))
      .subscribe((value) => response = value);
    jasmine.clock().tick(150);
    expect(response.totalElements).toBe(1);
    expect(response.content[0].id).toBe(1);
    expect(response.content[0].status).toBe(MemberStatus.REMOVED);
    http.expectNone(() => true);
  });

  it('handles absolute API URLs and query strings locally', () => {
    setup();
    let response!: MemberResponse;
    client.get<MemberResponse>('https://64-226-74-211.nip.io/api/members?page=0&size=2')
      .subscribe((value) => response = value);
    jasmine.clock().tick(150);

    expect(response.content.length).toBe(2);
    expect(response.totalElements).toBe(8);
    http.expectNone(() => true);
  });

  it('returns local errors for missing members, invalid input, and unknown APIs', () => {
    setup();
    const statuses: number[] = [];
    const capture = (error: { status: number }) => statuses.push(error.status);
    members.getById(9999).subscribe({ error: capture });
    members.create({ name: ' ' }).subscribe({ error: capture });
    client.get('/api/unknown').subscribe({ error: capture });

    expect(statuses).toEqual([404, 400, 404]);
    http.expectNone(() => true);
  });

  it('returns mock responses for every current auth API', () => {
    setup();
    let signIn!: { accessToken: string };
    client.post<{ accessToken: string }>('/api/auth/sign-in', { username: 'tester', password: 'any' })
      .subscribe((value) => signIn = value);
    jasmine.clock().tick(150);
    expect(signIn.accessToken).toBeTruthy();

    let profile!: { username: string; role: string };
    client.get<{ username: string; role: string }>('/api/users/me')
      .subscribe((value) => profile = value);
    jasmine.clock().tick(150);
    expect(profile.username).toBe('tester');
    expect(profile.role).toBe('ADMIN');

    let refreshed!: { accessToken: string };
    client.post<{ accessToken: string }>('/api/auth/refresh', {})
      .subscribe((value) => refreshed = value);
    jasmine.clock().tick(150);
    expect(refreshed.accessToken).toBe(signIn.accessToken);
    client.post('/api/auth/sign-out', {}).subscribe();
    jasmine.clock().tick(150);
    expect(sessionStorage.getItem('mock-auth-username')).toBeNull();
    http.expectNone(() => true);
  });

  it('lets translation assets load normally', () => {
    setup();
    let translation: unknown;
    client.get('/assets/i18n/ar.json').subscribe((value) => translation = value);
    http.expectOne('/assets/i18n/ar.json').flush({ LOGIN_BTN: 'دخول' });
    expect(translation).toEqual({ LOGIN_BTN: 'دخول' });
  });

  it('uses the real backend when mock mode is disabled', () => {
    setup(false);
    members.create({ name: 'Real Member' }).subscribe();
    const request = http.expectOne('https://64-226-74-211.nip.io/api/members');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: 'Real Member' });
    request.flush({ id: 10, name: 'Real Member' });
    expect(localStorage.getItem('mock-api-members-v1')).toBeNull();
  });

  it('recovers from invalid stored mock data', () => {
    setup();
    localStorage.setItem('mock-api-members-v1', 'invalid json');
    let response!: MemberResponse;
    members.get().subscribe((value) => response = value);
    jasmine.clock().tick(150);

    expect(response.totalElements).toBe(8);
    http.expectNone(() => true);
  });
});
