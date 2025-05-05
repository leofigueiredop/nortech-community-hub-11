import React from 'react';
import { useOptimizedTranslation } from '../hooks/useOptimizedTranslation';
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
  /** Whether to preload all languages for this translation */
  preloadAllLanguages?: boolean;
  /** Optional className for styling */
  className?: string;
  /** Optional style object */
  style?: React.CSSProperties;
}

/**
 * Component for rendering translated text with optimized loading and debug features
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
 * // With namespace and preloading
 * <DynamicTranslate 
 *   translationKey="submit"
 *   ns="forms"
 *   fallback="Submit"
 *   preloadAllLanguages={true}
 * />
 * ```
 */
export function DynamicTranslate({
  translationKey,
  ns,
  fallback,
  params,
  showMissingIndicator = true,
  preloadAllLanguages = false,
  className,
  style
}: DynamicTranslateProps) {
  const { t } = useOptimizedTranslation(ns, { preloadAllLanguages });
  const { isEnabled, wrapContent } = useTranslationDebug();

  // Get the translation with proper typing
  const translation = t(translationKey, fallback, { params });

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