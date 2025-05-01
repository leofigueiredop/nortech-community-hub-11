import React from 'react';
import { useTranslationWithFallback } from '../hooks/useTranslationWithFallback';
import { useTranslationDebug } from '../hooks/useTranslationDebug';
import type { SupportedNamespaces } from '../utils/i18n/types';

interface DynamicTranslateProps {
  /** The translation key */
  translationKey: string;
  /** Optional namespace for the translation */
  ns?: SupportedNamespaces;
  /** Optional fallback text if no translation is found */
  fallback?: string;
  /** Optional parameters for translation interpolation */
  params?: Record<string, any>;
  /** Whether to show visual indicators for missing translations in dev mode */
  showMissingIndicator?: boolean;
  /** Optional className for styling */
  className?: string;
  /** Optional style object */
  style?: React.CSSProperties;
}

/**
 * Component for rendering translated text with debug features in development
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <DynamicTranslate translationKey="greeting" fallback="Hello!" />
 * 
 * // With parameters
 * <DynamicTranslate 
 *   translationKey="welcome"
 *   params={{ name: "John" }}
 *   fallback="Welcome, {{name}}!"
 * />
 * 
 * // With namespace
 * <DynamicTranslate 
 *   translationKey="submit"
 *   ns="forms"
 *   fallback="Submit"
 * />
 * ```
 */
export function DynamicTranslate({
  translationKey,
  ns,
  fallback,
  params,
  showMissingIndicator = true,
  className,
  style
}: DynamicTranslateProps) {
  const { t } = useTranslationWithFallback({ ns });
  const { isEnabled, wrapContent } = useTranslationDebug();

  // Get the translation
  const translation = t(translationKey, {
    fallback,
    params
  });

  // Apply debug features in development
  const content = isEnabled && showMissingIndicator
    ? wrapContent(translation, translationKey, ns)
    : translation;

  // Use dangerouslySetInnerHTML for debug styling
  return (
    <span
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export type { DynamicTranslateProps }; 