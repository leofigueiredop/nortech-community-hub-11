import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import i18next from 'i18next';
import { languageService, LANGUAGE_EVENTS, LanguageChangeEvent } from '../languageService';
import { saveLanguagePreference, clearLanguagePreference, getLanguagePreference } from '../languagePreferences';
import { detectBrowserLanguage } from '../languageDetector';
import { PreferenceStorageProvider, PreferenceSource } from '../userPreferences';

// Mock dependencies
vi.mock('i18next', () => ({
  default: {
    on: vi.fn(),
    changeLanguage: vi.fn(),
    language: 'en-US',
  },
}));

vi.mock('../languagePreferences', () => ({
  saveLanguagePreference: vi.fn(),
  clearLanguagePreference: vi.fn(),
  getLanguagePreference: vi.fn(),
}));

vi.mock('../languageDetector', () => ({
  detectBrowserLanguage: vi.fn(),
  determineInitialLanguage: vi.fn(() => 'en-US'),
  isRTLLanguage: vi.fn((lang) => ['ar', 'he', 'fa', 'ur'].includes(lang.split('-')[0])),
  getTextDirection: vi.fn((lang) => ['ar', 'he', 'fa', 'ur'].includes(lang.split('-')[0]) ? 'rtl' : 'ltr'),
}));

describe('LanguageService', () => {
  let languageChangedCallback: (lng: string) => void;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Capture the callback registered with i18next.on
    vi.mocked(i18next.on).mockImplementation((event, callback) => {
      if (event === 'languageChanged') {
        languageChangedCallback = callback;
      }
      return i18next;
    });

    // Mock document methods
    document.documentElement.setAttribute = vi.fn();
  });

  afterEach(() => {
    // Clear all event listeners
    languageService.removeAllListeners();
  });

  describe('changeLanguage', () => {
    it('should change language and update preferences', async () => {
      await languageService.changeLanguage('pt-BR');

      expect(i18next.changeLanguage).toHaveBeenCalledWith('pt-BR');
      expect(saveLanguagePreference).toHaveBeenCalledWith('pt-BR');
    });

    it('should map unsupported language variants to supported ones', async () => {
      await languageService.changeLanguage('pt-PT');

      expect(i18next.changeLanguage).toHaveBeenCalledWith('pt-BR');
      expect(saveLanguagePreference).toHaveBeenCalledWith('pt-BR');
    });

    it('should throw error for completely unsupported languages', async () => {
      await expect(languageService.changeLanguage('fr-FR'))
        .rejects
        .toThrow('Language fr-FR is not supported');
    });

    it('should update document direction for RTL languages', async () => {
      await languageService.changeLanguage('ar-SA');

      expect(document.documentElement.setAttribute)
        .toHaveBeenCalledWith('dir', 'rtl');
    });
  });

  describe('language change events', () => {
    it('should emit LANGUAGE_CHANGED event', async () => {
      const listener = vi.fn();
      languageService.on(LANGUAGE_EVENTS.LANGUAGE_CHANGED, listener);

      await languageService.changeLanguage('pt-BR');
      languageChangedCallback('pt-BR');

      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        previousLanguage: 'en-US',
        newLanguage: 'pt-BR',
        fallbackUsed: false,
      }));
    });

    it('should emit FALLBACK_USED event when falling back', async () => {
      const listener = vi.fn();
      languageService.on(LANGUAGE_EVENTS.FALLBACK_USED, listener);

      await languageService.changeLanguage('pt-PT');
      languageChangedCallback('pt-PT');

      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        previousLanguage: 'en-US',
        newLanguage: 'pt-BR',
        requestedLanguage: 'pt-PT',
        fallbackUsed: true,
      }));
    });
  });

  describe('resetToDefault', () => {
    it('should clear preferences and use browser language', async () => {
      vi.mocked(detectBrowserLanguage).mockReturnValue('pt-BR');

      await languageService.resetToDefault();

      expect(clearLanguagePreference).toHaveBeenCalled();
      expect(i18next.changeLanguage).toHaveBeenCalledWith('pt-BR');
    });

    it('should use default language if browser detection fails', async () => {
      vi.mocked(detectBrowserLanguage).mockReturnValue(null);

      await languageService.resetToDefault();

      expect(clearLanguagePreference).toHaveBeenCalled();
      expect(i18next.changeLanguage).toHaveBeenCalledWith('en-US');
    });
  });

  describe('wouldUseFallback', () => {
    it('should correctly identify languages requiring fallback', () => {
      expect(languageService.wouldUseFallback('pt-PT')).toBe(true);
      expect(languageService.wouldUseFallback('en-GB')).toBe(true);
      expect(languageService.wouldUseFallback('fr-FR')).toBe(true);
    });

    it('should identify languages not requiring fallback', () => {
      expect(languageService.wouldUseFallback('pt-BR')).toBe(false);
      expect(languageService.wouldUseFallback('en-US')).toBe(false);
    });
  });

  describe('getFallbackChain', () => {
    it('should return correct fallback chain for pt-BR', () => {
      expect(languageService.getFallbackChain('pt-BR')).toEqual(['pt-BR', 'en-US']);
      expect(languageService.getFallbackChain('pt-PT')).toEqual(['pt-BR', 'en-US']);
    });

    it('should return correct fallback chain for en variants', () => {
      expect(languageService.getFallbackChain('en-GB')).toEqual(['en-US', 'en-US']);
    });

    it('should return default language for unsupported languages', () => {
      expect(languageService.getFallbackChain('fr-FR')).toEqual(['en-US']);
    });
  });

  describe('server preference sync', () => {
    let mockProvider: PreferenceStorageProvider;
    const userId = 'test-user-123';

    beforeEach(() => {
      mockProvider = {
        getUserPreferences: vi.fn(),
        saveUserPreferences: vi.fn(),
        clearUserPreferences: vi.fn(),
      };
      languageService.setServerStorageProvider(mockProvider);
    });

    it('should sync local preferences to server when no server preferences exist', async () => {
      vi.mocked(getLanguagePreference).mockReturnValue('pt-BR');
      vi.mocked(mockProvider.getUserPreferences).mockResolvedValue(null);

      const result = await languageService.syncWithServer(userId);

      expect(result?.source).toBe(PreferenceSource.LOCAL);
      expect(result?.preferences.language).toBe('pt-BR');
      expect(mockProvider.saveUserPreferences).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({ language: 'pt-BR' })
      );
    });

    it('should use server preferences when they exist', async () => {
      const serverPrefs = {
        language: 'pt-BR' as const,
        lastUpdated: new Date(),
      };
      vi.mocked(mockProvider.getUserPreferences).mockResolvedValue(serverPrefs);
      vi.mocked(getLanguagePreference).mockReturnValue('en-US');

      const result = await languageService.syncWithServer(userId);

      expect(result?.source).toBe(PreferenceSource.SERVER);
      expect(result?.preferences).toEqual(serverPrefs);
      expect(result?.conflictResolved).toBe(true);
      expect(i18next.changeLanguage).toHaveBeenCalledWith('pt-BR');
    });

    it('should handle missing server storage provider', async () => {
      languageService.setServerStorageProvider(undefined);
      const result = await languageService.syncWithServer(userId);
      expect(result).toBeNull();
    });

    it('should handle server errors gracefully', async () => {
      vi.mocked(mockProvider.getUserPreferences).mockRejectedValue(new Error('Server error'));
      const result = await languageService.syncWithServer(userId);
      expect(result).toBeNull();
    });

    it('should emit PREFERENCE_SYNCED event when resolving conflicts', async () => {
      const serverPrefs = {
        language: 'pt-BR' as const,
        lastUpdated: new Date(),
      };
      vi.mocked(mockProvider.getUserPreferences).mockResolvedValue(serverPrefs);
      vi.mocked(getLanguagePreference).mockReturnValue('en-US');

      const listener = vi.fn();
      languageService.on(LANGUAGE_EVENTS.PREFERENCE_SYNCED, listener);

      await languageService.syncWithServer(userId);

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          source: PreferenceSource.SERVER,
          preferences: serverPrefs,
          conflictResolved: true,
        })
      );
    });
  });
}); 