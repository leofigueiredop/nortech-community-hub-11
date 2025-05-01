import { UseTranslationResponse } from 'react-i18next';
import type { CustomTypeOptions, TFunction } from 'i18next';

type TranslationNamespaces = keyof CustomTypeOptions['resources'];

/**
 * Type-safe namespace merger for i18next translations
 * Combines multiple translation responses into a single object
 * while maintaining type safety
 * 
 * @example
 * ```typescript
 * const { t: commonT } = useTranslation('common');
 * const { t: formsT } = useTranslation('forms');
 * const { t: featuresT } = useTranslation('features');
 * 
 * const { t, ready } = mergeNamespaces({
 *   common: commonT,
 *   forms: formsT,
 *   features: featuresT,
 * });
 * 
 * // Type-safe access to translations:
 * t.common.actions.save
 * t.forms.labels.email
 * t.features.events.create.title
 * ```
 */
export function mergeNamespaces<
  T extends Record<TranslationNamespaces, TFunction<TranslationNamespaces, CustomTypeOptions>>
>(
  translationFns: T
): {
  t: T;
  ready: boolean;
} {
  return {
    t: translationFns,
    ready: true, // Since we're using individual t functions, they're already loaded
  };
}

// Helper type to convert union types to intersection types
type UnionToIntersection<U> = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

/**
 * Example usage:
 * 
 * const [commonT] = useTranslation('common');
 * const [formsT] = useTranslation('forms');
 * const [featuresT] = useTranslation('features');
 * 
 * const { t, ready } = mergeNamespaces([commonT, formsT, featuresT]);
 * 
 * // Now 't' will have type-safe access to all namespaces
 * t('common:actions.save');
 * t('forms:labels.email');
 * t('features:events.create.title');
 */ 