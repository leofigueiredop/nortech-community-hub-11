import { TFunction, TOptions } from 'i18next';
import i18n from '../../i18n';
import { SupportedNamespaces } from './types';

/**
 * Options for dynamic translation fallback
 */
export interface DynamicFallbackOptions<T extends SupportedNamespaces = 'common'> {
  /** The key to translate */
  key: string;
  /** Optional fallback text if no translation is found */
  fallback?: string;
  /** Optional parameters for translation interpolation */
  params?: Record<string, any>;
  /** Optional namespace for the translation */
  ns?: T;
  /** Whether to show visual indicators for missing translations in dev mode */
  showMissingIndicator?: boolean;
}

/**
 * Result of a dynamic translation attempt
 */
export interface DynamicTranslationResult {
  /** The translated text */
  text: string;
  /** The source of the translation (key, fallback, etc.) */
  source: 'translation' | 'default-language' | 'fallback-text' | 'key';
  /** Whether this was a fallback result */
  isFallback: boolean;
  /** The language the translation was found in */
  language: string;
}

/**
 * Handles dynamic translation with cascading fallback strategy:
 * 1. Try current language translation
 * 2. Try default language translation (en-US)
 * 3. Use provided fallback text
 * 4. Use the key itself
 */
export function getDynamicTranslation<T extends SupportedNamespaces = 'common'>(
  t: TFunction<T>,
  options: DynamicFallbackOptions<T>
): DynamicTranslationResult {
  const {
    key,
    fallback,
    params = {},
    ns,
    showMissingIndicator = process.env.NODE_ENV === 'development'
  } = options;

  const currentLang = i18n.language;
  const defaultLang = 'en-US';

  // Try current language first
  const translationOptions: TOptions = { ...params };
  if (ns) translationOptions.defaultNS = ns;
  
  const translation = t(key, '', translationOptions);
  if (translation !== key) {
    return {
      text: translation,
      source: 'translation',
      isFallback: false,
      language: currentLang
    };
  }

  // Try default language if different from current
  if (currentLang !== defaultLang) {
    const defaultTranslation = i18n.getFixedT(defaultLang)(key, '', translationOptions);
    if (defaultTranslation !== key) {
      return {
        text: defaultTranslation,
        source: 'default-language',
        isFallback: true,
        language: defaultLang
      };
    }
  }

  // Use provided fallback text
  if (fallback !== undefined) {
    return {
      text: fallback,
      source: 'fallback-text',
      isFallback: true,
      language: currentLang
    };
  }

  // Use key as last resort
  const finalText = showMissingIndicator ? `[${key}]` : key;
  return {
    text: finalText,
    source: 'key',
    isFallback: true,
    language: currentLang
  };
}

/**
 * Hook-friendly wrapper for getDynamicTranslation that returns just the text
 */
export function getTranslationWithFallback<T extends SupportedNamespaces = 'common'>(
  t: TFunction<T>,
  options: DynamicFallbackOptions<T>
): string {
  return getDynamicTranslation(t, options).text;
}

// Development-only utilities
const devUtils = process.env.NODE_ENV === 'development' ? {
  /**
   * Log missing translations to help identify gaps
   */
  logMissingTranslation(
    key: string,
    ns?: SupportedNamespaces,
    lang: string = i18n.language
  ) {
    console.warn(
      `Missing translation: "${key}"${ns ? ` in namespace "${ns}"` : ''} for language "${lang}"`
    );
  },

  /**
   * Check if a translation exists for a given key
   */
  hasTranslation(
    key: string,
    ns?: SupportedNamespaces,
    lang: string = i18n.language
  ): boolean {
    const t = i18n.getFixedT(lang);
    const options: TOptions = {};
    if (ns) options.defaultNS = ns;
    return t(key, '', options) !== key;
  }
} : null;

export const { logMissingTranslation, hasTranslation } = devUtils || {}; 