import i18next from 'i18next';
import { SupportedLanguage } from './supportedLanguages';
import { SupportedNamespaces } from './types';
import { performanceMonitor } from './performanceMonitor';
import { translationCache } from './translationCache';
import { cdnManager } from './cdnConfig';

/**
 * Configuration for translation loading
 */
interface LoaderConfig {
  /** Whether to use code splitting */
  enableCodeSplitting: boolean;
  /** Whether to use aggressive caching */
  aggressiveCaching: boolean;
  /** Maximum concurrent loading operations */
  maxConcurrentLoads: number;
  /** Timeout for loading operations (ms) */
  loadTimeout: number;
}

/**
 * Default configuration
 */
const defaultConfig: LoaderConfig = {
  enableCodeSplitting: true,
  aggressiveCaching: true,
  maxConcurrentLoads: 3,
  loadTimeout: 5000
};

/**
 * Optimized translation loader with code splitting support
 */
class TranslationLoader {
  private config: LoaderConfig;
  private loadingPromises = new Map<string, Promise<void>>();
  private activeLoads = 0;
  private loadQueue: Array<() => Promise<void>> = [];

  constructor(config: Partial<LoaderConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Load a translation namespace with code splitting
   */
  async loadNamespace(
    namespace: SupportedNamespaces,
    language: SupportedLanguage = i18next.language as SupportedLanguage,
    options: { force?: boolean } = {}
  ): Promise<void> {
    const key = `${language}:${namespace}`;

    // Return existing promise if already loading
    if (this.loadingPromises.has(key) && !options.force) {
      return this.loadingPromises.get(key)!;
    }

    const loadPromise = this.queueLoad(async () => {
      const startTime = performance.now();
      let fromCache = false;
      let hasError = false;
      let size = 0;

      try {
        // Try loading from cache first if aggressive caching is enabled
        if (this.config.aggressiveCaching) {
          const version = cdnManager.getCurrentVersion();
          const cachedData = await translationCache.get(language, namespace, version);

          if (cachedData) {
            await i18next.addResourceBundle(language, namespace, cachedData, true, true);
            fromCache = true;
            size = new TextEncoder().encode(JSON.stringify(cachedData)).length;
            return;
          }
        }

        // Use code splitting for dynamic imports if enabled
        if (this.config.enableCodeSplitting) {
          const module = await this.importNamespace(language, namespace);
          await i18next.addResourceBundle(language, namespace, module.default, true, true);
          size = new TextEncoder().encode(JSON.stringify(module.default)).length;

          // Cache the loaded translations
          if (this.config.aggressiveCaching) {
            const version = cdnManager.getCurrentVersion();
            await translationCache.set(language, namespace, version, module.default);
          }
        } else {
          // Fallback to regular loading
          await i18next.loadNamespaces(namespace);
          const resources = i18next.getResourceBundle(language, namespace);
          size = resources ? new TextEncoder().encode(JSON.stringify(resources)).length : 0;
        }
      } catch (error) {
        console.error(`Failed to load namespace ${namespace}:`, error);
        hasError = true;
        throw error;
      } finally {
        // Record performance metrics
        const loadTime = performance.now() - startTime;
        performanceMonitor.recordLoadingMetrics(language, namespace, {
          loadTime,
          fromCache,
          size,
          hasError
        });
      }
    });

    this.loadingPromises.set(key, loadPromise);

    try {
      await Promise.race([
        loadPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Translation load timeout')), this.config.loadTimeout)
        )
      ]);
    } finally {
      this.loadingPromises.delete(key);
    }
  }

  /**
   * Preload multiple namespaces in parallel
   */
  async preloadNamespaces(
    namespaces: SupportedNamespaces[],
    language: SupportedLanguage = i18next.language as SupportedLanguage
  ): Promise<void> {
    await Promise.all(
      namespaces.map(namespace => this.loadNamespace(namespace, language))
    );
  }

  /**
   * Import a translation namespace using dynamic imports
   */
  private async importNamespace(
    language: SupportedLanguage,
    namespace: SupportedNamespaces
  ): Promise<{ default: Record<string, any> }> {
    // Use dynamic import for code splitting
    return import(
      /* webpackChunkName: "i18n-[request]" */
      `../../../public/locales/${language}/${namespace}.json`
    );
  }

  /**
   * Queue a load operation respecting concurrency limits
   */
  private async queueLoad(loadFn: () => Promise<void>): Promise<void> {
    if (this.activeLoads >= this.config.maxConcurrentLoads) {
      // Queue the load operation
      return new Promise((resolve, reject) => {
        this.loadQueue.push(async () => {
          try {
            await loadFn();
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    // Execute the load operation
    this.activeLoads++;
    try {
      await loadFn();
    } finally {
      this.activeLoads--;
      // Process next queued operation
      if (this.loadQueue.length > 0) {
        const nextLoad = this.loadQueue.shift()!;
        nextLoad();
      }
    }
  }

  /**
   * Update loader configuration
   */
  setConfig(config: Partial<LoaderConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current loader configuration
   */
  getConfig(): LoaderConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const translationLoader = new TranslationLoader(); 