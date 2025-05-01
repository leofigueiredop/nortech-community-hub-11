import { SupportedLanguage } from './supportedLanguages';
import { SupportedNamespaces } from './types';

/**
 * CDN configuration for translation files
 */
interface CDNConfig {
  /** Base URL for the CDN */
  baseUrl: string;
  /** Version of translation files */
  version: string;
  /** Cache duration in seconds */
  cacheDuration: number;
  /** Fallback URL if CDN is unavailable */
  fallbackUrl: string;
}

/**
 * Default CDN configuration
 */
const defaultConfig: CDNConfig = {
  baseUrl: import.meta.env.VITE_TRANSLATIONS_CDN_URL || '/locales',
  version: import.meta.env.VITE_TRANSLATIONS_VERSION || '1.0.0',
  cacheDuration: 24 * 60 * 60, // 24 hours
  fallbackUrl: '/locales'
};

/**
 * CDN configuration manager
 */
class CDNManager {
  private config: CDNConfig;
  private failedUrls = new Set<string>();
  private retryTimeouts = new Map<string, number>();

  constructor(config: Partial<CDNConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Get the current version of translations
   */
  getCurrentVersion(): string {
    return this.config.version;
  }

  /**
   * Get the URL for a translation file
   */
  getTranslationUrl(language: SupportedLanguage, namespace: SupportedNamespaces): string {
    const key = `${language}/${namespace}`;
    
    // If CDN failed recently, use fallback
    if (this.failedUrls.has(key)) {
      return `${this.config.fallbackUrl}/${key}.json`;
    }
    
    return `${this.config.baseUrl}/${this.config.version}/${key}.json`;
  }

  /**
   * Handle CDN failure for a specific URL
   */
  handleFailure(language: SupportedLanguage, namespace: SupportedNamespaces): void {
    const key = `${language}/${namespace}`;
    this.failedUrls.add(key);

    // Clear existing retry timeout
    const existingTimeout = this.retryTimeouts.get(key);
    if (existingTimeout) {
      window.clearTimeout(existingTimeout);
    }

    // Set retry timeout
    const timeout = window.setTimeout(() => {
      this.failedUrls.delete(key);
      this.retryTimeouts.delete(key);
    }, 5 * 60 * 1000); // 5 minutes

    this.retryTimeouts.set(key, timeout);
  }

  /**
   * Update CDN configuration
   */
  updateConfig(newConfig: Partial<CDNConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.failedUrls.clear();
    
    // Clear all retry timeouts
    this.retryTimeouts.forEach(timeout => window.clearTimeout(timeout));
    this.retryTimeouts.clear();
  }

  /**
   * Get cache control headers for translation files
   */
  getCacheControl(): string {
    return `public, max-age=${this.config.cacheDuration}, stale-while-revalidate=60`;
  }

  /**
   * Check if a URL is using the CDN
   */
  isUsingCDN(url: string): boolean {
    return url.startsWith(this.config.baseUrl);
  }
}

export const cdnManager = new CDNManager(); 