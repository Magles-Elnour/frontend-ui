import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member, MemberResponse, MemberStatus } from '../../admin/members/models/member';

const MEMBERS_STORAGE_KEY = 'mock-api-members-v1';
const MOCK_SESSION_KEY = 'mock-auth-username';
const MOCK_TOKEN = 'mock.eyJyb2xlIjoiQURNSU4ifQ==.signature';

@Injectable({ providedIn: 'root' })
export class MockApiService {
  private members = this.loadMembers();
  private nextId = Math.max(0, ...this.members.map((member) => member.id!)) + 1;

  handle(req: HttpRequest<unknown>, url: URL): HttpResponse<unknown> {
    const path = url.pathname.replace(/\/$/, '');

    if (req.method === 'POST' && path === '/api/auth/sign-in') {
      const body = req.body as { username?: string } | null;
      sessionStorage.setItem(MOCK_SESSION_KEY, body?.username || 'developer');
      return this.response(req, { accessToken: MOCK_TOKEN });
    }
    if (req.method === 'POST' && path === '/api/auth/refresh') {
      return this.response(req, { accessToken: MOCK_TOKEN });
    }
    if (req.method === 'POST' && path === '/api/auth/sign-out') {
      sessionStorage.removeItem(MOCK_SESSION_KEY);
      return this.response(req, null, 204);
    }
    if (req.method === 'GET' && path === '/api/users/me') {
      return this.response(req, {
        id: 'mock-admin',
        username: sessionStorage.getItem(MOCK_SESSION_KEY) || 'developer',
        role: 'ADMIN',
      });
    }

    if (path === '/api/members') {
      if (req.method === 'GET') return this.response(req, this.listMembers(url.searchParams));
      if (req.method === 'POST') {
        const member = this.memberFromBody(req, this.nextId);
        this.nextId++;
        this.members.push(member);
        this.saveMembers();
        return this.response(req, member, 201);
      }
    }

    const match = path.match(/^\/api\/members\/(\d+)$/);
    if (match) {
      const id = Number(match[1]);
      const index = this.members.findIndex((member) => member.id === id);
      if (index === -1) return this.fail(req, 404, 'Member not found');

      if (req.method === 'GET') return this.response(req, this.members[index]);
      if (req.method === 'PUT') {
        this.members[index] = this.memberFromBody(req, id);
        this.saveMembers();
        return this.response(req, this.members[index]);
      }
      if (req.method === 'DELETE') {
        this.members[index] = { ...this.members[index], status: MemberStatus.REMOVED };
        this.saveMembers();
        return this.response(req, null, 204);
      }
    }

    // Keep every /api request local, including endpoints not implemented by the UI yet.
    return this.fail(req, 404, `No mock response for ${req.method} ${path}`);
  }

  private listMembers(params: URLSearchParams): MemberResponse {
    const number = this.integerParam(params, 'page', 0, 0);
    const size = this.integerParam(params, 'size', 20, 1);
    const name = (params.get('name') || '').trim().toLocaleLowerCase();
    const status = params.get('status');
    const filtered = this.members.filter((member) =>
      (member.name || '').toLocaleLowerCase().includes(name) &&
      (status ? member.status === status : member.status !== MemberStatus.REMOVED),
    );

    return {
      content: filtered.slice(number * size, (number + 1) * size),
      number,
      size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
    };
  }

  private integerParam(params: URLSearchParams, key: string, fallback: number, min: number): number {
    const value = params.get(key);
    const parsed = value === null ? fallback : Number(value);
    return Number.isSafeInteger(parsed) && parsed >= min ? parsed : fallback;
  }

  private memberFromBody(req: HttpRequest<unknown>, id: number): Member {
    const body = req.body as Member | null;
    if (!body || typeof body.name !== 'string' || !body.name.trim()) {
      return this.fail(req, 400, 'Member name is required');
    }
    if (body.status != null && !Object.values(MemberStatus).includes(body.status)) {
      return this.fail(req, 400, 'Invalid member status');
    }
    return {
      id,
      name: body.name.trim(),
      phoneNumber: body.phoneNumber ?? null,
      status: body.status ?? MemberStatus.ACTIVE,
      startDate: body.startDate ?? null,
    };
  }

  private loadMembers(): Member[] {
    try {
      const stored = localStorage.getItem(MEMBERS_STORAGE_KEY);
      if (stored) {
        const members: unknown = JSON.parse(stored);
        if (Array.isArray(members) && members.every((member) =>
          member && Number.isSafeInteger(member.id) && member.id > 0 &&
          typeof member.name === 'string' && Object.values(MemberStatus).includes(member.status),
        )) return members;
      }
    } catch {
      // A stale or unavailable browser store should not prevent local development.
    }

    const names = ['أحمد محمد', 'محمود علي', 'عمر حسن', 'يوسف إبراهيم',
      'محمد خالد', 'مصطفى سعيد', 'عبد الرحمن أحمد', 'علي حسين'];
    return names.map((name, index) => ({
      id: index + 1,
      name,
      phoneNumber: `0100000000${index + 1}`,
      status: index === 2 ? MemberStatus.SUSPENDED :
        index === 5 ? MemberStatus.DIED : MemberStatus.ACTIVE,
      startDate: '2026-01-01',
    }));
  }

  private saveMembers(): void {
    try {
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(this.members));
    } catch {
      // Continue with in-memory data if browser storage is unavailable.
    }
  }

  private response(req: HttpRequest<unknown>, body: unknown, status = 200): HttpResponse<unknown> {
    return new HttpResponse({ body: structuredClone(body), status, url: req.urlWithParams });
  }

  private fail(req: HttpRequest<unknown>, status: number, message: string): never {
    throw new HttpErrorResponse({
      status,
      statusText: status === 400 ? 'Bad Request' : 'Not Found',
      url: req.urlWithParams,
      error: { message },
    });
  }
}
