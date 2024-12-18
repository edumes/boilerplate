import i18next from 'i18next';
import i18nextBackend from 'i18next-fs-backend';
import { join } from 'path';

export async function setupI18n() {
  await i18next.use(i18nextBackend).init({
    backend: {
      loadPath: join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'pt'],
    defaultNS: 'translation',
    preload: ['en', 'pt'],
    load: 'languageOnly',
    detection: {
      order: ['header', 'querystring', 'cookie'],
      lookupHeader: 'accept-language',
      lookupQuerystring: 'lang',
      lookupCookie: 'lang',
      caches: ['cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

  return i18next;
}
