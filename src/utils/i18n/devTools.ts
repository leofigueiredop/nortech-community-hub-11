import i18n from '../../i18n';
import { SupportedLanguage } from './supportedLanguages';
import { SupportedNamespaces } from './types';

/**
 * Development tools for i18n
 */
class I18nDevTools {
  private watchedFiles = new Set<string>();
  private reloadCallbacks = new Set<() => void>();

  /**
   * Initialize development tools
   */
  init(): void {
    if (process.env.NODE_ENV !== 'development') return;

    // Watch for translation file changes
    if (import.meta.hot) {
      import.meta.hot.on('i18n:update', ({ language, namespace }) => {
        this.reloadTranslations(language, namespace);
      });
    }
  }

  /**
   * Watch a translation file for changes
   */
  watchFile(language: SupportedLanguage, namespace: SupportedNamespaces): void {
    if (process.env.NODE_ENV !== 'development') return;

    const key = this.getFileKey(language, namespace);
    if (this.watchedFiles.has(key)) return;

    this.watchedFiles.add(key);
    console.debug(`[i18n] Watching translations for ${language}/${namespace}`);
  }

  /**
   * Register a callback for translation reloads
   */
  onReload(callback: () => void): () => void {
    this.reloadCallbacks.add(callback);
    return () => this.reloadCallbacks.delete(callback);
  }

  /**
   * Reload translations for a specific language and namespace
   */
  private async reloadTranslations(language: SupportedLanguage, namespace: SupportedNamespaces): Promise<void> {
    try {
      // Clear cache for the namespace
      await i18n.reloadResources(language, namespace);
      
      // Notify callbacks
      this.reloadCallbacks.forEach(callback => callback());
      
      console.debug(`[i18n] Reloaded translations for ${language}/${namespace}`);
    } catch (error) {
      console.error(`[i18n] Failed to reload translations for ${language}/${namespace}:`, error);
    }
  }

  /**
   * Get a unique key for a language/namespace pair
   */
  private getFileKey(language: SupportedLanguage, namespace: SupportedNamespaces): string {
    return `${language}:${namespace}`;
  }
}

export const i18nDevTools = new I18nDevTools(); 