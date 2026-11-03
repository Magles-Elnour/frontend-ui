import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { getTranslocoTestingModule } from '../../../../testing/transloco-testing';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent, getTranslocoTestingModule()],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    fixture.componentRef.setInput('header', ['MEMBERS', 'MEMBERS_LIST']);
  });

  it('renders plain text crumbs when no links are given', async () => {
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('a').length).toBe(0);
    expect(el.textContent).toContain('MEMBERS');
    expect(el.textContent).toContain('MEMBERS_LIST');
  });

  it('renders linked crumbs so the user can navigate back', async () => {
    fixture.componentRef.setInput('links', [
      ['/', 'admin', 'members'],
      ['/', 'admin', 'members', 'list'],
    ]);
    await fixture.whenStable();
    const anchors = Array.from<HTMLAnchorElement>(
      fixture.nativeElement.querySelectorAll('a'),
    );
    expect(anchors.map((a) => a.getAttribute('href'))).toEqual([
      '/admin/members',
      '/admin/members/list',
    ]);
    expect(anchors[0].getAttribute('aria-current')).toBeNull();
    expect(anchors[1].getAttribute('aria-current')).toBe('page');
  });
});