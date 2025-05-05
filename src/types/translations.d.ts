// Supported languages and namespaces
export type SupportedLanguage = 'en-US' | 'pt-BR';
export type Namespace = 'common' | 'forms' | 'features' | 'auth' | 'navigation' | 'plurals';

// Basic translation key type
export type TranslationKey = string;

// Translation key props interface
export interface TranslationProps {
  translationKey?: TranslationKey;
  values?: Record<string, any>;
}

// Aria label props interface
export interface AriaLabelProps {
  ariaLabel?: TranslationKey;
}

// UI component translation keys (for documentation and type hints)
export interface UITranslations {
  tabs: {
    aria: {
      tabList: string;
      tab: string;
      tabPanel: string;
    };
  };
  // Add other UI component keys as needed
}

// Extend i18next's typing to be more permissive
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: string;
    resources: Record<string, Record<string, any>>;
    returnNull: false;
  }
}

// Helper function to create translation keys
export function createTranslationKey(namespace: Namespace, key: string): TranslationKey {
  return `${namespace}.${key}` as TranslationKey;
}