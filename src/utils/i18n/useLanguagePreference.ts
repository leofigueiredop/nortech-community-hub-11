import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage } from './languageDetector';
import { languageService, LANGUAGE_EVENTS, LanguageChangeEvent } from './languageService';

interface UseLanguagePreference {
  currentLanguage: SupportedLanguage;
  changeLanguage: (language: string) => Promise<void>;
  resetToDefault: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  direction: 'ltr' | 'rtl';
  fallbackUsed: boolean;
  requestedLanguage?: string;
}

/**
 * React hook for managing language preferences
 * Integrates with i18next and provides a clean API for language management
 */
export function useLanguagePreference(): UseLanguagePreference {
  const { ready } = useTranslation();
  const [error, setError] = useState<Error | null>(null);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [requestedLanguage, setRequestedLanguage] = useState<string>();

  // Effect to handle language change events
  useEffect(() => {
    const handleLanguageChange = (event: LanguageChangeEvent) => {
      setFallbackUsed(event.fallbackUsed);
      setRequestedLanguage(event.requestedLanguage);
      setError(null); // Clear any previous errors
    };

    // Subscribe to language change events
    languageService.on(LANGUAGE_EVENTS.LANGUAGE_CHANGED, handleLanguageChange);

    return () => {
      languageService.off(LANGUAGE_EVENTS.LANGUAGE_CHANGED, handleLanguageChange);
    };
  }, []);

  const changeLanguage = useCallback(async (language: string) => {
    try {
      await languageService.changeLanguage(language);
      setError(null);
    } catch (e) {
      const error = e instanceof Error ? e : new Error('Failed to change language');
      setError(error);
      throw error;
    }
  }, []);

  const resetToDefault = useCallback(async () => {
    try {
      await languageService.resetToDefault();
      setError(null);
    } catch (e) {
      const error = e instanceof Error ? e : new Error('Failed to reset language');
      setError(error);
      throw error;
    }
  }, []);

  return {
    currentLanguage: languageService.getCurrentLanguage(),
    changeLanguage,
    resetToDefault,
    isLoading: !ready,
    error,
    direction: languageService.getCurrentDirection(),
    fallbackUsed,
    requestedLanguage,
  };
} 