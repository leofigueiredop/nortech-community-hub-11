import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveLanguagePreference,
  getLanguagePreference,
  clearLanguagePreference,
  refreshPreferenceTimestamp,
} from '../languagePreferences';

describe('languagePreferences', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; },
      length: 0,
      key: (_index: number) => '',
    };
  })();

  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    // Replace global localStorage with mock
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    // Reset all mocks
    vi.clearAllMocks();
    // Reset timer mocks
    vi.setSystemTime(new Date('2024-01-01'));
  });

  describe('saveLanguagePreference', () => {
    it('should save valid language preference', () => {
      saveLanguagePreference('en-US');
      const stored = JSON.parse(localStorage.getItem('i18nextLng') || '');
      expect(stored.language).toBe('en-US');
      expect(stored.timestamp).toBeDefined();
    });

    it('should throw error for unsupported language', () => {
      expect(() => saveLanguagePreference('fr-FR')).toThrow('Language fr-FR is not supported');
    });

    it('should handle localStorage errors', () => {
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      expect(() => saveLanguagePreference('en-US')).toThrow('Failed to save language preference');
    });
  });

  describe('getLanguagePreference', () => {
    it('should return null when no preference is stored', () => {
      expect(getLanguagePreference()).toBeNull();
    });

    it('should return valid stored preference', () => {
      const preference = {
        language: 'pt-BR',
        timestamp: Date.now(),
      };
      localStorage.setItem('i18nextLng', JSON.stringify(preference));
      expect(getLanguagePreference()).toBe('pt-BR');
    });

    it('should return null and clear expired preference', () => {
      const oldTimestamp = Date.now() - (31 * 24 * 60 * 60 * 1000); // 31 days old
      const preference = {
        language: 'en-US',
        timestamp: oldTimestamp,
      };
      localStorage.setItem('i18nextLng', JSON.stringify(preference));
      expect(getLanguagePreference()).toBeNull();
      expect(localStorage.getItem('i18nextLng')).toBeNull();
    });

    it('should handle invalid stored data', () => {
      localStorage.setItem('i18nextLng', 'invalid json');
      expect(getLanguagePreference()).toBeNull();
    });

    it('should clear and return null for unsupported language', () => {
      const preference = {
        language: 'fr-FR',
        timestamp: Date.now(),
      };
      localStorage.setItem('i18nextLng', JSON.stringify(preference));
      expect(getLanguagePreference()).toBeNull();
      expect(localStorage.getItem('i18nextLng')).toBeNull();
    });
  });

  describe('clearLanguagePreference', () => {
    it('should clear stored preference', () => {
      const preference = {
        language: 'en-US',
        timestamp: Date.now(),
      };
      localStorage.setItem('i18nextLng', JSON.stringify(preference));
      clearLanguagePreference();
      expect(localStorage.getItem('i18nextLng')).toBeNull();
    });

    it('should handle localStorage errors silently', () => {
      vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      expect(() => clearLanguagePreference()).not.toThrow();
    });
  });

  describe('refreshPreferenceTimestamp', () => {
    it('should update timestamp of valid preference', () => {
      const initialTime = new Date('2024-01-01').getTime();
      const preference = {
        language: 'en-US',
        timestamp: initialTime,
      };
      localStorage.setItem('i18nextLng', JSON.stringify(preference));
      
      // Move time forward
      vi.setSystemTime(new Date('2024-01-02'));
      
      expect(refreshPreferenceTimestamp()).toBe(true);
      const updated = JSON.parse(localStorage.getItem('i18nextLng') || '');
      expect(updated.timestamp).toBeGreaterThan(initialTime);
    });

    it('should return false when no preference exists', () => {
      expect(refreshPreferenceTimestamp()).toBe(false);
    });

    it('should clear and return false for invalid language', () => {
      const preference = {
        language: 'fr-FR',
        timestamp: Date.now(),
      };
      localStorage.setItem('i18nextLng', JSON.stringify(preference));
      expect(refreshPreferenceTimestamp()).toBe(false);
      expect(localStorage.getItem('i18nextLng')).toBeNull();
    });

    it('should handle localStorage errors', () => {
      const preference = {
        language: 'en-US',
        timestamp: Date.now(),
      };
      localStorage.setItem('i18nextLng', JSON.stringify(preference));
      
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      expect(refreshPreferenceTimestamp()).toBe(false);
    });
  });
}); 