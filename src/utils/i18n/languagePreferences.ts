import { SupportedLanguage, isSupportedLanguage } from './languageDetector';

const STORAGE_KEY = 'i18nextLng';
const PREFERENCE_EXPIRY_DAYS = 30;

interface LanguagePreference {
  language: SupportedLanguage;
  timestamp: number;
}

/**
 * Checks if localStorage is available in the current environment
 * @returns boolean indicating if localStorage can be used
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Saves the user's language preference to localStorage with an expiration timestamp
 * @param language - The language code to save
 * @throws Error if localStorage is not available or language is not supported
 */
export function saveLanguagePreference(language: string): void {
  if (!isLocalStorageAvailable()) {
    throw new Error('localStorage is not available');
  }

  if (!isSupportedLanguage(language)) {
    throw new Error(`Language ${language} is not supported`);
  }

  const preference: LanguagePreference = {
    language,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
  } catch (e) {
    console.error('Failed to save language preference:', e);
    throw new Error('Failed to save language preference');
  }
}

/**
 * Retrieves the user's language preference from localStorage if it exists and hasn't expired
 * @returns The saved language code or null if no valid preference exists
 */
export function getLanguagePreference(): SupportedLanguage | null {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const preference = JSON.parse(stored) as LanguagePreference;
    
    // Check if preference has expired
    const expiryTime = preference.timestamp + (PREFERENCE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    if (Date.now() > expiryTime) {
      clearLanguagePreference();
      return null;
    }

    // Validate the stored language
    if (isSupportedLanguage(preference.language)) {
      return preference.language;
    }

    // Clear invalid preference
    clearLanguagePreference();
    return null;
  } catch (e) {
    console.error('Failed to retrieve language preference:', e);
    return null;
  }
}

/**
 * Clears the saved language preference from localStorage
 */
export function clearLanguagePreference(): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear language preference:', e);
  }
}

/**
 * Updates the expiration timestamp of the current language preference
 * @returns boolean indicating if the update was successful
 */
export function refreshPreferenceTimestamp(): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;

    const preference = JSON.parse(stored) as LanguagePreference;
    
    if (!isSupportedLanguage(preference.language)) {
      clearLanguagePreference();
      return false;
    }

    preference.timestamp = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
    return true;
  } catch (e) {
    console.error('Failed to refresh language preference timestamp:', e);
    return false;
  }
} 