import 'i18next';

// Define supported namespaces
export type SupportedNamespaces = 
  | 'common'
  | 'forms'
  | 'features'
  | 'auth'
  | 'navigation'
  | 'plurals';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof import('../../public/locales/en-US/common.json');
      forms: typeof import('../../public/locales/en-US/forms.json');
      features: typeof import('../../public/locales/en-US/features.json');
      auth: typeof import('../../public/locales/en-US/auth.json');
      navigation: typeof import('../../public/locales/en-US/navigation.json');
      plurals: typeof import('../../public/locales/en-US/plurals.json');
    };
  }

  // Add types for dynamic namespace loading
  interface i18n {
    loadNamespaces(ns: string | string[], callback?: () => void): Promise<void>;
    hasLoadedNamespace(ns: string): boolean;
  }
} 