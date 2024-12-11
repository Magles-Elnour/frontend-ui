import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { UserRoles, UrlsNames } from '../models/shared-models';
import { UserService } from '../services/user.service';
import { MatExpansionModule } from '@angular/material/expansion';

export enum ScreenState {
  smallOpened = 'smallOpened ',
  smallClosed = 'smallClosed',
  mediumOpened = 'mediumOpened ',
  mediumClosed = 'mediumClosed',
  large = 'large ',
  xLarge = 'xLarge ',
}
@Component({
  selector: 'app-side-nave',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatListModule,
    RouterModule,
    TranslocoPipe,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    NgClass,
    MatExpansionModule,
  ],

  templateUrl: './side-nave.component.html',
  styleUrl: './side-nave.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNaveComponent {
  userRoles = UserRoles;
  urlsNames = UrlsNames;
  ScreenState = ScreenState;
  screen = signal('');
  userService = inject(UserService);
  listItems: {
    id: number;
    title: string;
    iconClass: string;
    link: UrlsNames[];
    navList: {
      title: string;
      link: UrlsNames[];
    }[];
  }[] = [
    {
      id: 1,
      title: 'MEMBERS',
      iconClass: 'group',
      link: [UrlsNames.MEMBERS],
      navList: [
        {
          title: 'MEMBERS_LIST',
          link: [UrlsNames.MEMBERS, UrlsNames.MEMBERS_LIST],
        },
        {
          title: 'MEMBERS_ATTENDANCE',
          link: [UrlsNames.MEMBERS, UrlsNames.MEMBERS_ATTENDANCE],
        },
      ],
    },
    {
      id: 1,
      title: 'CHANTING',
      link: [UrlsNames.CHANTING],
      iconClass: 'mic',
      navList: [
        {
          title: 'CHANTING_LIST',
          link: [UrlsNames.CHANTING, UrlsNames.CHANTING_LIST],
        },
        {
          title: 'CHANTING_ATTENDANCE',
          link: [UrlsNames.CHANTING, UrlsNames.CHANTING_ATTENDANCE],
        },
      ],
    },
    {
      id: 1,
      title: 'COUNCIL_PROGRAM',
      link: [UrlsNames.COUNCIL_PROGRAM],
      iconClass: 'bedtime',
      navList: [
        {
          title: 'CHANTING_LIST',
          link: [UrlsNames.COUNCIL_PROGRAM, UrlsNames.CHANTING_LIST],
        },
        {
          title: 'CHANTING_ATTENDANCE',
          link: [UrlsNames.COUNCIL_PROGRAM, UrlsNames.CHANTING_ATTENDANCE],
        },
      ],
    },

    {
      id: 1,
      title: 'REPORTS',
      link: [UrlsNames.REPORTS],
      iconClass: 'insert_chart',
      navList: [
        {
          title: 'CHANTING_LIST',
          link: [UrlsNames.REPORTS, UrlsNames.CHANTING_LIST],
        },
        {
          title: 'CHANTING_ATTENDANCE',
          link: [UrlsNames.REPORTS, UrlsNames.CHANTING_ATTENDANCE],
        },
      ],
    },
    {
      id: 1,
      title: 'MANAGERS',
      link: [UrlsNames.MANAGERS],
      iconClass: 'shield',
      navList: [
        {
          title: 'CHANTING_LIST',
          link: [UrlsNames.MANAGERS, UrlsNames.CHANTING_LIST],
        },
        {
          title: 'CHANTING_ATTENDANCE',
          link: [UrlsNames.MANAGERS, UrlsNames.CHANTING_ATTENDANCE],
        },
      ],
    },
  ];

  constructor() {
    this.updateSidnavStyle();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateSidnavStyle();
  }

  updateSidnavStyle() {
    if (window.innerWidth < 600) {
      this.screen.set(ScreenState.smallClosed);
    } else if (window.innerWidth < 960) {
      this.screen.set(ScreenState.mediumClosed);
    } else if (window.innerWidth < 1280) {
      this.screen.set(ScreenState.large);
    } else {
      this.screen.set(ScreenState.xLarge);
    }
  }
}
