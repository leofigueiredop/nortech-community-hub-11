import { useTranslation } from 'react-i18next';
import { getTranslationWithFallback, DynamicFallbackOptions } from '@/utils/i18n/dynamicFallback';
import type { SupportedNamespaces } from '@/utils/i18n/types';
import type { TFunction } from 'i18next';

interface UseTranslationWithFallbackOptions {
  ns?: SupportedNamespaces;
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
export function useTranslationWithFallback(options: UseTranslationWithFallbackOptions = {}) {
  const { ns = 'common', showMissingIndicator } = options;
  const { t: baseT, ready, i18n } = useTranslation(ns);

  const t = (
    key: string,
    options: Omit<DynamicFallbackOptions, 'key' | 'ns' | 'showMissingIndicator'> = {}
  ) => {
    return getTranslationWithFallback(baseT as TFunction<'common'>, {
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