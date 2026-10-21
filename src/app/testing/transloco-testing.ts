import { TranslocoTestingModule } from '@jsverse/transloco';

export function getTranslocoTestingModule() {
  return TranslocoTestingModule.forRoot({
    langs: { ar: {} },
    translocoConfig: {
      availableLangs: ['ar'],
      defaultLang: 'ar',
      missingHandler: { logMissingKey: false },
    },
    preloadLangs: true,
  });
}
