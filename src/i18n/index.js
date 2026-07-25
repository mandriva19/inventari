import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ka from './locales/ka.json';
import ru from './locales/ru.json';
import tr from './locales/tr.json';
import ar from './locales/ar.json';

const RTL_LANGS = ['ar'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ka: { translation: ka },
      ru: { translation: ru },
      tr: { translation: tr },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ka', 'ru', 'tr', 'ar'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'catalog_lang',
    },
  });

/** Call this whenever the language changes to update <html> dir + lang attributes */
export function applyLangToDocument(lang) {
  const dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', dir);
}

// Apply on initial load
applyLangToDocument(i18n.language);

// Re-apply on every language change
i18n.on('languageChanged', applyLangToDocument);

export default i18n;
