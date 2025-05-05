import { useTranslation } from 'react-i18next';
import { getTranslationWithFallback } from '@/utils/i18n/dynamicFallback';

interface UseTranslationWithFallbackOptions {
  ns?: string;
  showMissingIndicator?: boolean;
}

/**
 * Custom hook that combines useTranslation with advanced fallback handling
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t, ready } = useTranslationWithFallback({ ns: 'common' });
 * 
 *   return (
 *     <div>
 *       {t('greeting', { fallback: 'Hello!' })}
 *       {t('welcome', { 
 *         params: { name: 'John' },
 *         fallback: 'Welcome, {{name}}!'
 *       })}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTranslationWithFallback(options: any = {}) {
  const { ns = 'common', showMissingIndicator } = options
  const { t: baseT, ready, i18n } = useTranslation(ns);

  const t = (key: string, options: any = {}) => {
    return getTranslationWithFallback(baseT as any, {
      key,
      ns,
      showMissingIndicator,
      ...options
    });
  };

  return {
    t,
    ready,
    i18n
  };
}

export type { UseTranslationWithFallbackOptions }; 