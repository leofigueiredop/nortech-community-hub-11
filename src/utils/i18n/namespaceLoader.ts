import i18next from 'i18next';
import React from 'react';
import { SupportedLanguage } from './supportedLanguages';
import { namespaceRegistry, NamespacePriority } from './namespaceRegistry';
import type { SupportedNamespaces } from './types';
import { translationCache } from './translationCache';
import { cdnManager } from './cdnConfig';
import { performanceMonitor } from './performanceMonitor';

/**
 * Map of namespace loading states
 */
const loadingNamespaces = new Map<string, Promise<void>>();

/**
 * Options for loading namespaces
 */
interface LoadNamespaceOptions {
  /** Whether to preload translations for all supported languages */
  preloadAllLanguages?: boolean;
  /** Whether to cache the loaded namespace */
  cache?: boolean;
  /** Force loading regardless of priority */
  force?: boolean;
}

/**
 * Dynamically loads a translation namespace and its dependencies
 */
export async function loadNamespace(
  namespace: SupportedNamespaces,
  language?: SupportedLanguage,
  options: LoadNamespaceOptions = {}
): Promise<void> {
  const key = `${namespace}:${language || i18next.language}`;
  
  // Return existing promise if namespace is already loading
  if (loadingNamespaces.has(key)) {
    return loadingNamespaces.get(key)!;
  }

  const loadPromise = (async () => {
    const startTime = performance.now();
    let fromCache = false;
    let hasError = false;
    let size = 0;

    try {
      const currentVersion = cdnManager.getCurrentVersion();
      
      // Try to get from cache first
      const cachedData = await translationCache.get(
        language || i18next.language as SupportedLanguage,
        namespace,
        currentVersion
      );
      
      if (cachedData) {
        // Use cached data
        await i18next.addResourceBundle(
          language || i18next.language,
          namespace,
          cachedData,
          true,
          true
        );
        fromCache = true;
        size = new TextEncoder().encode(JSON.stringify(cachedData)).length;
      } else {
        // Load from CDN and cache
        await i18next.loadNamespaces(namespace);
        
        // Get the loaded resources and cache them
        const resources = i18next.getResourceBundle(
          language || i18next.language,
          namespace
        );
        
        if (resources) {
          size = new TextEncoder().encode(JSON.stringify(resources)).length;
          await translationCache.set(
            language || i18next.language as SupportedLanguage,
            namespace,
            currentVersion,
            resources
          );
        }
      }

      if (options.preloadAllLanguages) {
        const languages = i18next.languages.filter(lng => lng !== (language || i18next.language));
        await Promise.all(
          languages.map(lng =>
            loadNamespace(namespace, lng as SupportedLanguage, {
              ...options,
              preloadAllLanguages: false
            })
          )
        );
      }
    } catch (error) {
      console.error(`Failed to load namespace ${namespace}:`, error);
      hasError = true;
      throw error;
    } finally {
      // Record performance metrics
      const loadTime = performance.now() - startTime;
      performanceMonitor.recordLoadingMetrics(
        language || i18next.language as SupportedLanguage,
        namespace,
        {
          loadTime,
          fromCache,
          size,
          hasError
        }
      );
    }
  })();

  loadingNamespaces.set(key, loadPromise);
  
  try {
    await loadPromise;
  } finally {
    loadingNamespaces.delete(key);
  }
}

/**
 * Hook to use namespaces with dynamic loading
 */
export function useNamespaces(namespaces: SupportedNamespaces | SupportedNamespaces[]) {
  const [ready, setReady] = React.useState(false);
  const nsArray = Array.isArray(namespaces) ? namespaces : [namespaces];
  
  React.useEffect(() => {
    let mounted = true;

    // Load all requested namespaces
    Promise.all(nsArray.map(ns => {
      const config = namespaceRegistry.getConfig(ns);
      const priority = config?.priority || NamespacePriority.Normal;
      
      // Load based on priority
      switch (priority) {
        case NamespacePriority.Critical:
        case NamespacePriority.High:
          return loadNamespace(ns);
        case NamespacePriority.Normal:
          return new Promise<void>(resolve => {
            // Small delay for normal priority
            setTimeout(() => resolve(loadNamespace(ns)), 100);
          });
        case NamespacePriority.Low:
          return new Promise<void>(resolve => {
            // Load low priority namespaces during idle time
            if ('requestIdleCallback' in window) {
              window.requestIdleCallback(() => resolve(loadNamespace(ns)));
            } else {
              setTimeout(() => resolve(loadNamespace(ns)), 500);
            }
          });
        case NamespacePriority.Lazy:
          return new Promise<void>(resolve => {
            // Load lazy namespaces after a longer delay
            setTimeout(() => resolve(loadNamespace(ns)), 1000);
          });
      }
    }))
    .then(() => {
      if (mounted) {
        setReady(true);
      }
    })
    .catch(error => {
      console.error('Failed to load namespaces:', error);
      if (mounted) {
        setReady(true); // Set ready even on error to prevent infinite loading
      }
    });

    return () => {
      mounted = false;
    };
  }, [nsArray.join(',')]);

  return {
    ready: ready && nsArray.every(ns => namespaceRegistry.isLoaded(ns, i18next.language)),
    t: i18next.t.bind(i18next)
  };
}

/**
 * Preloads a namespace for all supported languages
 */
export async function preloadNamespace(namespace: SupportedNamespaces): Promise<void> {
  return loadNamespace(namespace, undefined, { preloadAllLanguages: true });
}

/**
 * Checks if a namespace is loaded for the current language
 */
export function isNamespaceLoaded(namespace: string, language?: string): boolean {
  return namespaceRegistry.isLoaded(namespace, language || i18next.language);
}

/**
 * Gets the loading state of a namespace
 */
export function getNamespaceLoadingState(namespace: string, language?: string): 'loading' | 'loaded' | 'error' {
  const key = `${namespace}:${language || i18next.language}`;
  
  if (loadingNamespaces.has(key)) {
    return 'loading';
  }
  
  return namespaceRegistry.isLoaded(namespace, language || i18next.language) ? 'loaded' : 'error';
}

/**
 * Preload critical and high priority namespaces
 */
export async function preloadHighPriorityNamespaces(): Promise<void> {
  const criticalNamespaces = namespaceRegistry.getNamespacesByPriority(NamespacePriority.Critical);
  const highPriorityNamespaces = namespaceRegistry.getNamespacesByPriority(NamespacePriority.High);
  
  // Load critical namespaces first
  await Promise.all(
    criticalNamespaces.map(ns => loadNamespace(ns, undefined, { preloadAllLanguages: true }))
  );
  
  // Then load high priority namespaces
  await Promise.all(
    highPriorityNamespaces.map(ns => loadNamespace(ns))
  );
} 