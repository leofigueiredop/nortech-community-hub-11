import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { translationLoader } from '../utils/i18n/translationLoader';
import type { SupportedNamespaces } from '../utils/i18n/types';
import { performanceMonitor } from '../utils/i18n/performanceMonitor';

/**
 * Options for the optimized translation hook
 */
interface UseOptimizedTranslationOptions {
  /** Whether to preload all languages for the namespace */
  preloadAllLanguages?: boolean;
  /** Whether to force loading even if already loaded */
  force?: boolean;
  /** Whether to use suspense */
  useSuspense?: boolean;
}

/**
 * Hook that combines the optimized translation loader with React's Suspense
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { t, ready } = useOptimizedTranslation('common');
 * 
 * // With options
 * const { t, ready } = useOptimizedTranslation(['common', 'forms'], {
 *   preloadAllLanguages: true
 * });
 * ```
 */
export function useOptimizedTranslation(
  ns?: SupportedNamespaces | SupportedNamespaces[],
  options: UseOptimizedTranslationOptions = {}
) {
  const {
    preloadAllLanguages = false,
    force = false,
    useSuspense = true
  } = options;

  // Get translation function from i18next
  const translation = useTranslation(ns, { useSuspense });

  useEffect(() => {
    const startTime = performance.now();

    // Load namespaces using optimized loader
    const namespaces = Array.isArray(ns) ? ns : [ns || 'common'];
    
    Promise.all(
      namespaces.map(namespace =>
        translationLoader.loadNamespace(namespace, undefined, { force })
      )
    ).then(() => {
      // Record performance metrics for the hook
      const loadTime = performance.now() - startTime;
      performanceMonitor.recordLoadingMetrics(
        translation.i18n.language as any,
        namespaces[0],
        {
          loadTime,
          fromCache: false, // We don't know if it was from cache here
          size: 0, // Size is recorded in the loader
          hasError: false
        }
      );

      // Preload other languages if requested
      if (preloadAllLanguages) {
        translationLoader.preloadNamespaces(namespaces);
      }
    }).catch(error => {
      console.error('Failed to load translations:', error);
    });
  }, [ns, translation.i18n.language, force, preloadAllLanguages]);

  return translation;
}

export type { UseOptimizedTranslationOptions }; 