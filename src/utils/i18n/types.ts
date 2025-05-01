/**
 * Supported namespaces for translations
 */
export type SupportedNamespaces = 'common' | 'forms' | 'features' | 'auth' | 'navigation';

/**
 * Translation resource type for type-safe translations
 */
export interface TranslationResource {
  [key: string]: string | TranslationResource;
}

/**
 * Translation resources by namespace
 */
export type TranslationResources = {
  [K in SupportedNamespaces]: TranslationResource;
};

/**
 * Translation resources by language
 */
export interface TranslationResourcesByLanguage {
  [language: string]: TranslationResources;
} 