import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';
import type { InitOptions } from 'i18next';

// Static imports for all translation files
import enCommon from './locales/en-US/common.json';
import enForms from './locales/en-US/forms.json';
import enNavigation from './locales/en-US/navigation.json';
import enAuth from './locales/en-US/auth.json';
import enPlurals from './locales/en-US/plurals.json';
import enFeatures from './locales/en-US/features.json';

import ptCommon from './locales/pt-BR/common.json';
import ptForms from './locales/pt-BR/forms.json';
import ptNavigation from './locales/pt-BR/navigation.json';
import ptAuth from './locales/pt-BR/auth.json';
import ptPlurals from './locales/pt-BR/plurals.json';
import ptFeatures from './locales/pt-BR/features.json';

const resources = {
  'en-US': {
    common: enCommon,
    forms: enForms,
    navigation: enNavigation,
    auth: enAuth,
    plurals: enPlurals,
    features: enFeatures,
  },
  'pt-BR': {
    common: ptCommon,
    forms: ptForms,
    navigation: ptNavigation,
    auth: ptAuth,
    plurals: ptPlurals,
    features: ptFeatures,
  },
};

const config: InitOptions = {
  fallbackLng: {
    'pt-BR': ['en-US'],
    'default': ['en-US']
  },
  supportedLngs: ['en-US', 'pt-BR'],
  defaultNS: 'common',
  ns: ['common', 'forms', 'navigation', 'auth', 'plurals', 'features'],
  fallbackNS: 'common',
  resources,
  detection: {
    order: ['querystring', 'localStorage', 'navigator'],
    caches: ['localStorage'],
    lookupQuerystring: 'lng',
    lookupLocalStorage: 'i18nextLng'
  },
  interpolation: {
    escapeValue: false
  },
  load: 'currentOnly',
  preload: ['en-US'],
  debug: process.env.NODE_ENV === 'development',
  react: {
    useSuspense: true,
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    nsMode: 'default',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'span'],
  }
};

i18next
  .use(LanguageDetector)
  .use(ICU)
  .use(initReactI18next)
  .init(config)
  .catch(error => {
    console.error('Failed to initialize i18next:', error);
  });

if (process.env.NODE_ENV === 'development') {
  import('./utils/i18n/devTools').then(({ i18nDevTools }) => {
    i18nDevTools.init();
  });
}

export default i18next; 