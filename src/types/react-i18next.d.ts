
declare module 'react-i18next' {
  import { i18n } from 'i18next';
  
  export function useTranslation(
    ns?: string | string[],
    options?: { i18n?: i18n }
  ): {
    t: (key: string, options?: object) => string;
    i18n: i18n;
    ready: boolean;
  };
  
  export function initReactI18next: {
    type: string;
    init: (instance: any) => any;
  };
}
