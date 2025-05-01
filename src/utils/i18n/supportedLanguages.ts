export type SupportedLanguage = 'en-US' | 'pt-BR';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  region: string;
  isDefault?: boolean;
}

export interface LanguageMapping {
  [key: string]: SupportedLanguage;
}

export const supportedLanguages: LanguageConfig[] = [
  {
    code: 'en-US',
    name: 'English',
    region: 'United States',
    isDefault: true,
  },
  {
    code: 'pt-BR',
    name: 'Português',
    region: 'Brasil',
  },
];

// Map similar language codes to our supported languages
export const languageMappings: LanguageMapping = {
  'en': 'en-US',
  'en-GB': 'en-US',
  'en-AU': 'en-US',
  'en-CA': 'en-US',
  'pt': 'pt-BR',
  'pt-PT': 'pt-BR',
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en-US';

/**
 * Checks if a language code is fully supported by the application
 */
export function isSupportedLanguage(code: string): code is SupportedLanguage {
  return supportedLanguages.some(lang => lang.code === code);
}

/**
 * Maps a language code to a supported language using the mapping table
 * Returns null if no mapping exists
 */
export function mapToSupportedLanguage(code: string): SupportedLanguage | null {
  // Check if the language is already supported
  if (isSupportedLanguage(code)) {
    return code;
  }

  // Check language mappings
  const mappedLanguage = languageMappings[code];
  if (mappedLanguage) {
    return mappedLanguage;
  }

  // Try to match just the language part (e.g., 'en' from 'en-NZ')
  const languagePart = code.split('-')[0];
  return languageMappings[languagePart] || null;
} 