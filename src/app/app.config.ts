import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  LOCALE_ID,
  importProvidersFrom,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { authInterceptor } from './interceptors/auth.interceptor';
import { UserService } from './services/user.service';

const ArabicRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) {
    return `1 من ${page + 1} الصفحة`;
  }
  return `الصفحة ${page + 1} من ${Math.ceil(
    length / pageSize
  )} /  المجموع: ${length} عنصر `;
};

export function getArabicPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'العناصر في الصفحة :';
  paginatorIntl.nextPageLabel = 'الصفحة التالية';
  paginatorIntl.previousPageLabel = 'الصفحة السابقة';
  paginatorIntl.firstPageLabel = 'الصفحة الأولى';
  paginatorIntl.lastPageLabel = 'الصفحة الأخيرة';

  paginatorIntl.getRangeLabel = ArabicRangeLabel;

  return paginatorIntl;
}

registerLocaleData(localeAr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    // Restore the session from the refresh-token cookie BEFORE the router/guards run,
    // so a full page reload doesn't bounce an authenticated user back to login.
    provideAppInitializer(() => firstValueFrom(inject(UserService).initSession())),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(MatSnackBarModule),
    provideTransloco({
      config: {
        availableLangs: ['ar'],
        defaultLang: 'ar',
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    { provide: MatPaginatorIntl, useValue: getArabicPaginatorIntl() },
    { provide: MAT_DATE_LOCALE, useValue: 'ar-EG' },
    { provide: LOCALE_ID, useValue: 'ar-EG' },
  ],
};
