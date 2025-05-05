import { translationLoader } from './translationLoader';
import { performanceMonitor } from './performanceMonitor';
import { SupportedLanguage } from './supportedLanguages';
import { SupportedNamespaces } from './types';

/**
 * Configuration for startup optimization
 */
interface StartupConfig {
  /** Critical namespaces that must be loaded before app start */
  criticalNamespaces: SupportedNamespaces[];
  /** Namespaces to preload after critical ones */
  preloadNamespaces: SupportedNamespaces[];
  /** Languages to preload */
  preloadLanguages: SupportedLanguage[];
  /** Whether to use aggressive caching */
  aggressiveCaching: boolean;
  /** Maximum concurrent loads during startup */
  maxConcurrentLoads: number;
}

/**
 * Default startup configuration
 */
const defaultConfig: StartupConfig = {
  criticalNamespaces: ['common', 'navigation'],
  preloadNamespaces: ['auth', 'forms'],
  preloadLanguages: ['en-US'],
  aggressiveCaching: true,
  maxConcurrentLoads: 3
};

/**
 * Manages translation loading during application startup
 */
class StartupOptimizer {
  private config: StartupConfig;
  private isInitialized = false;

  constructor(config: Partial<StartupConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Initialize translation loading
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    const startTime = performance.now();

    try {
      // Configure loader
      translationLoader.setConfig({
        enableCodeSplitting: true,
        aggressiveCaching: this.config.aggressiveCaching,
        maxConcurrentLoads: this.config.maxConcurrentLoads,
        loadTimeout: 5000
      });

      // Load critical namespaces first
      await this.loadCriticalNamespaces();

      // Start preloading other namespaces
      this.preloadNonCriticalNamespaces();

      // Record startup metrics
      const loadTime = performance.now() - startTime;
      performanceMonitor.recordLoadingMetrics('en-US', 'common', {
        loadTime,
        fromCache: false,
        size: 0,
        hasError: false
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize translations:', error);
      throw error;
    }
  }

  /**
   * Load critical namespaces that are required for app startup
   */
  private async loadCriticalNamespaces(): Promise<void> {
    const startTime = performance.now();

    try {
      // Load critical namespaces for default language
      await Promise.all(
        this.config.criticalNamespaces.map(namespace =>
          translationLoader.loadNamespace(namespace, 'en-US', { force: true })
        )
      );

      // Record metrics for each critical namespace
      const loadTime = performance.now() - startTime;
      this.config.criticalNamespaces.forEach(namespace => {
        performanceMonitor.recordLoadingMetrics('en-US', namespace, {
          loadTime: loadTime / this.config.criticalNamespaces.length, // Average time per namespace
          fromCache: false,
          size: 0,
          hasError: false
        });
      });
    } catch (error) {
      console.error('Failed to load critical namespaces:', error);
      throw error;
    }
  }

  /**
   * Preload non-critical namespaces in the background
   */
  private preloadNonCriticalNamespaces(): void {
    // Start preloading in the background
    Promise.all(
      this.config.preloadLanguages.map(language =>
        this.config.preloadNamespaces.map(namespace =>
          translationLoader.loadNamespace(namespace, language)
        )
      ).flat()
    ).catch(error => {
      console.error('Failed to preload namespaces:', error);
    });
  }

  /**
   * Update startup configuration
   */
  setConfig(config: Partial<StartupConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current startup configuration
   */
  getConfig(): StartupConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const startupOptimizer = new StartupOptimizer(); 