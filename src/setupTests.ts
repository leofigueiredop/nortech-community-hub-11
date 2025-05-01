// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// Mock languageService
vi.mock('./utils/i18n/languageService', () => ({
  languageService: {
    getCurrentLanguage: vi.fn().mockReturnValue('en-US'),
    getCurrentDirection: vi.fn().mockReturnValue('ltr'),
    changeLanguage: vi.fn(),
    resetToDefault: vi.fn(),
    wouldUseFallback: vi.fn(),
    getFallbackChain: vi.fn(),
    getTelemetryStats: vi.fn(),
    setServerStorageProvider: vi.fn(),
    syncWithServer: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
  },
  LANGUAGE_EVENTS: {
    LANGUAGE_CHANGED: 'languageChanged',
    FALLBACK_USED: 'fallbackUsed',
    PREFERENCE_SYNCED: 'preferenceSynced'
  }
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
}); 