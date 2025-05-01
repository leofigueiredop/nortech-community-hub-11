import i18next from 'i18next';
import { getLanguagePreference } from './languagePreferences';
import {
  DEFAULT_LANGUAGE,
  mapToSupportedLanguage,
} from './supportedLanguages';

/**
 * List of supported languages in the application
 */
export const SUPPORTED_LANGUAGES = ['en-US', 'pt-BR'] as const;

/**
 * Type for supported language codes
 */
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

/**
 * Checks if a given language code is supported by the application
 * @param language - The language code to check
 * @returns boolean indicating if the language is supported
 */
export function isSupportedLanguage(language: string): language is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
}

/**
 * Extracts the base language code from a full language code
 * @param language - The full language code (e.g., 'en-US', 'pt_BR')
 * @returns The normalized base language code (e.g., 'en', 'pt')
 */
export function getBaseLanguage(language: string): string {
  // Handle both hyphen and underscore formats
  const normalizedLang = language.replace('_', '-');
  return normalizedLang.split('-')[0].toLowerCase();
}

/**
 * Detects the browser's language setting
 * @returns The detected language code or null if detection fails
 */
export function detectBrowserLanguage(): string | null {
  try {
    // Try navigator.language first
    if (navigator.language) {
      return navigator.language;
    }

    // Fallback to languages array if available
    if (navigator.languages && navigator.languages.length > 0) {
      return navigator.languages[0];
    }

    return null;
  } catch (e) {
    console.warn('Failed to detect browser language:', e);
    return null;
  }
}

/**
 * Determines the initial language to use based on the following priority:
 * 1. User's saved preference
 * 2. Browser's language setting
 * 3. Default language (en-US)
 * 
 * @returns The determined language code that is guaranteed to be supported
 */
export function determineInitialLanguage(): SupportedLanguage {
  try {
    // Step 1: Check for user preference
    const savedPreference = getLanguagePreference();
    if (savedPreference) {
      return savedPreference;
    }

    // Step 2: Try browser language detection
    const browserLanguage = detectBrowserLanguage();
    if (browserLanguage) {
      const mappedLanguage = mapToSupportedLanguage(browserLanguage);
      if (mappedLanguage) {
        return mappedLanguage;
      }
    }

    // Step 3: Fall back to default language
    return DEFAULT_LANGUAGE;
  } catch (e) {
    console.error('Error determining initial language:', e);
    return DEFAULT_LANGUAGE;
  }
}

/**
 * Determines if a language code represents a right-to-left (RTL) language
 * Add more RTL language codes as needed
 */
export function isRTLLanguage(languageCode: string): boolean {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  const language = languageCode.split('-')[0].toLowerCase();
  return rtlLanguages.includes(language);
}

/**
 * Gets the text direction (ltr or rtl) for a given language
 */
export function getTextDirection(languageCode: string): 'ltr' | 'rtl' {
  return isRTLLanguage(languageCode) ? 'rtl' : 'ltr';
}

/**
 * Gets the current language from i18next
 * @returns The current language code
 */
export function getCurrentLanguage(): SupportedLanguage {
  const currentLang = i18next.language;
  return isSupportedLanguage(currentLang) ? currentLang : 'en-US';
}

/**
 * Changes the application language
 * @param language - The language code to switch to
 * @throws Error if the language is not supported
 * @returns Promise that resolves when the language change is complete
 */
export async function changeLanguage(language: string): Promise<void> {
  if (!isSupportedLanguage(language)) {
    throw new Error(`Language ${language} is not supported. Supported languages are: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }

  await i18next.changeLanguage(language);
} 