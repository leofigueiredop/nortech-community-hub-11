/**
 * DynamicTranslationService interface for handling dynamic content translations.
 */
import { DynamicTranslationApiClient, MockDynamicTranslationApiClient, DynamicTranslationApiConfig } from './dynamicTranslationApiClient';
import { languageService } from './languageService';
import { TranslationCache, CacheConfig } from './translationCache';
import { SupportedLanguage, isSupportedLanguage, DEFAULT_LANGUAGE } from './supportedLanguages';

/**
 * Configuration options for the dynamic translation service
 */
export interface DynamicTranslationConfig {
  /** API client configuration */
  apiConfig: {
    endpoint: string;
    batchSize?: number;
    throttleMs?: number;
    timeoutMs?: number;
    retryEnabled?: boolean;
    maxRetries?: number;
    retryDelayMs?: number;
  };
  /** Cache configuration */
  cacheConfig?: CacheConfig;
  /** Whether to show visual indicators for missing translations in development */
  showMissingIndicators?: boolean;
  /** Whether to log missing translations to console */
  logMissingTranslations?: boolean;
}

/**
 * Interpolates parameters into a translation string
 * @param text The text containing parameter placeholders (e.g., "Hello {{name}}")
 * @param params The parameters to interpolate
 * @returns The interpolated string
 */
function interpolate(text: string, params?: Record<string, any>): string {
  if (!params) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = params[key];
    return value !== undefined ? String(value) : `{{${key}}}`;
  });
}

export interface DynamicTranslationService {
  /**
   * Translate a dynamic content key
   * @param key The translation key
   * @param fallback Optional fallback text if translation is missing
   * @param params Optional parameters to interpolate into the translation
   * @returns Promise that resolves to the translated text
   */
  translateDynamic(key: string, fallback?: string, params?: Record<string, any>): Promise<string>;

  /**
   * Preload translations for a set of keys
   * @param keys Array of translation keys to preload
   * @returns Promise that resolves when preloading is complete
   */
  preloadDynamicTranslations(keys: string[]): Promise<void>;

  /**
   * Clear the translation cache
   */
  clearCache(): void;

  /**
   * Get cache metrics for monitoring
   */
  getCacheMetrics(): { hits: number; misses: number; evictions: number };

  /**
   * Clean up event listeners
   */
  dispose(): void;
}

/**
 * Error class for dynamic translation failures
 */
export class DynamicTranslationError extends Error {
  constructor(
    message: string,
    public readonly key: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'DynamicTranslationError';
  }
}

/**
 * Service for handling dynamic content translations
 */
export class DynamicTranslationServiceImpl implements DynamicTranslationService {
  private apiClient: DynamicTranslationApiClient;
  private cache: TranslationCache;
  private config: Required<DynamicTranslationConfig>;
  private currentLanguage: SupportedLanguage;
  private languageChangeHandler: () => void;

  constructor(config: DynamicTranslationConfig) {
    this.config = {
      apiConfig: {
        endpoint: config.apiConfig.endpoint,
        batchSize: config.apiConfig.batchSize ?? 50,
        throttleMs: config.apiConfig.throttleMs ?? 1000,
        timeoutMs: config.apiConfig.timeoutMs ?? 5000,
        retryEnabled: config.apiConfig.retryEnabled ?? true,
        maxRetries: config.apiConfig.maxRetries ?? 3,
        retryDelayMs: config.apiConfig.retryDelayMs ?? 1000
      },
      cacheConfig: {
        ttl: config.cacheConfig?.ttl ?? 24 * 60 * 60,
        maxSize: config.cacheConfig?.maxSize ?? 5 * 1024 * 1024,
        offlineSupport: config.cacheConfig?.offlineSupport ?? true
      },
      showMissingIndicators: config.showMissingIndicators ?? process.env.NODE_ENV === 'development',
      logMissingTranslations: config.logMissingTranslations ?? process.env.NODE_ENV === 'development'
    };

    this.apiClient = process.env.NODE_ENV === 'development'
      ? new MockDynamicTranslationApiClient()
      : new DynamicTranslationApiClient(this.config.apiConfig);
    
    this.cache = new TranslationCache();
    this.cache.updateConfig(this.config.cacheConfig);
    this.currentLanguage = languageService.getCurrentLanguage() as SupportedLanguage;

    // Set up language change handler
    this.languageChangeHandler = () => {
      const newLanguage = languageService.getCurrentLanguage();
      if (newLanguage !== this.currentLanguage && isSupportedLanguage(newLanguage)) {
        this.currentLanguage = newLanguage;
        // Clear cache when language changes
        this.cache.cleanup();
      }
    };
    languageService.on('languageChanged', this.languageChangeHandler);
  }

  /**
   * Translate a dynamic content key
   */
  async translateDynamic(
    key: string,
    fallback?: string,
    params?: Record<string, any>
  ): Promise<string> {
    const language = this.currentLanguage;
    const version = '1.0'; // TODO: Implement versioning

    try {
      // Check cache first
      const cached = await this.cache.get(language, 'common', version);
      if (cached && cached[key]) {
        return this.interpolate(cached[key], params);
      }

      // Fetch from API
      const translations = await this.apiClient.fetchTranslations([key], language);

      if (translations[key]) {
        // Cache the translation
        await this.cache.set(language, 'common', version, { [key]: translations[key] });
        return this.interpolate(translations[key], params);
      }

      // Handle missing translation
      if (this.config.logMissingTranslations) {
        console.warn(`Missing dynamic translation for key: ${key} (${language})`);
      }

      const fallbackText = fallback || (
        this.config.showMissingIndicators
          ? `[${key}]`
          : key
      );
      return this.interpolate(fallbackText, params);

    } catch (error) {
      // Log API errors but don't throw to the caller
      console.error('Dynamic translation error:', error);
      const fallbackText = fallback || (
        this.config.showMissingIndicators
          ? `[${key}]`
          : key
      );
      return this.interpolate(fallbackText, params);
    }
  }

  /**
   * Preload translations for a set of keys
   */
  async preloadDynamicTranslations(keys: string[]): Promise<void> {
    try {
      const version = '1.0'; // TODO: Implement versioning
      
      // Filter out keys that are already cached
      const cached = await this.cache.get(this.currentLanguage, 'common', version) || {};
      const uncachedKeys = keys.filter(key => !cached[key]);
      
      if (uncachedKeys.length === 0) return;

      // Fetch translations for uncached keys
      const translations = await this.apiClient.fetchTranslations(
        uncachedKeys,
        this.currentLanguage
      );

      // Cache the translations
      if (Object.keys(translations).length > 0) {
        await this.cache.set(
          this.currentLanguage,
          'common',
          version,
          translations
        );
      }

    } catch (error) {
      // Log error but don't throw since this is a preload operation
      console.error('Failed to preload translations:', error);
    }
  }

  /**
   * Clear the translation cache
   */
  clearCache(): void {
    this.cache.cleanup();
  }

  /**
   * Get cache metrics for monitoring
   */
  getCacheMetrics() {
    // TODO: Implement cache metrics
    return {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }

  /**
   * Clean up event listeners
   */
  dispose(): void {
    languageService.off('languageChanged', this.languageChangeHandler);
  }

  /**
   * Interpolate parameters into a translation string
   */
  private interpolate(text: string, params?: Record<string, any>): string {
    if (!params) return text;
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const value = params[key];
      return value !== undefined ? String(value) : `{{${key}}}`;
    });
  }
}

// Export a singleton instance with the mock client for development
const defaultConfig: DynamicTranslationConfig = {
  apiConfig: {
    endpoint: process.env.VITE_API_ENDPOINT || '',
    batchSize: 50,
    throttleMs: 1000,
    timeoutMs: 5000,
    retryEnabled: true,
    maxRetries: 3,
    retryDelayMs: 1000
  },
  cacheConfig: {
    ttl: 24 * 60 * 60, // 24 hours
    maxSize: 5 * 1024 * 1024, // 5MB
    offlineSupport: true
  },
  showMissingIndicators: process.env.NODE_ENV === 'development',
  logMissingTranslations: process.env.NODE_ENV === 'development'
};

export const dynamicTranslationService = new DynamicTranslationServiceImpl(
  process.env.NODE_ENV === 'development'
    ? {
        ...defaultConfig,
        apiConfig: {
          ...defaultConfig.apiConfig,
          endpoint: 'mock://api'
        }
      }
    : defaultConfig
); 