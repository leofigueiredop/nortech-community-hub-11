import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  SUPPORTED_LANGUAGES,
  isSupportedLanguage,
  getBaseLanguage,
  detectBrowserLanguage,
  getCurrentLanguage,
  changeLanguage,
  determineInitialLanguage,
  isRTLLanguage,
  getTextDirection,
} from '../languageDetector';
import i18n from '../../../i18n';
import { getLanguagePreference } from '../languagePreferences';

// Mock languagePreferences
vi.mock('../languagePreferences', () => ({
  getLanguagePreference: vi.fn(),
}));

describe('languageDetector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset navigator mock
    Object.defineProperty(window.navigator, 'language', {
      value: undefined,
      configurable: true,
    });
    Object.defineProperty(window.navigator, 'languages', {
      value: undefined,
      configurable: true,
    });
  });

  describe('isSupportedLanguage', () => {
    it('should return true for supported languages', () => {
      expect(isSupportedLanguage('en-US')).toBe(true);
      expect(isSupportedLanguage('pt-BR')).toBe(true);
    });

    it('should return false for unsupported languages', () => {
      expect(isSupportedLanguage('fr-FR')).toBe(false);
      expect(isSupportedLanguage('es-ES')).toBe(false);
      expect(isSupportedLanguage('invalid')).toBe(false);
    });
  });

  describe('getBaseLanguage', () => {
    it('should extract base language from locale codes', () => {
      expect(getBaseLanguage('en-US')).toBe('en');
      expect(getBaseLanguage('pt-BR')).toBe('pt');
      expect(getBaseLanguage('fr-FR')).toBe('fr');
    });

    it('should handle simple language codes', () => {
      expect(getBaseLanguage('en')).toBe('en');
      expect(getBaseLanguage('pt')).toBe('pt');
    });

    it('should convert to lowercase', () => {
      expect(getBaseLanguage('EN-US')).toBe('en');
      expect(getBaseLanguage('PT-BR')).toBe('pt');
    });
  });

  describe('detectBrowserLanguage', () => {
    it('should detect language from navigator.language', () => {
      Object.defineProperty(window.navigator, 'language', {
        value: 'pt-BR',
        configurable: true,
      });

      expect(detectBrowserLanguage()).toBe('pt-BR');
    });

    it('should fallback to navigator.languages[0]', () => {
      Object.defineProperty(window.navigator, 'languages', {
        value: ['en-US', 'pt-BR'],
        configurable: true,
      });

      expect(detectBrowserLanguage()).toBe('en-US');
    });

    it('should return null when no language is detected', () => {
      expect(detectBrowserLanguage()).toBeNull();
    });

    it('should handle detection errors gracefully', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      Object.defineProperty(window.navigator, 'language', {
        get: () => { throw new Error('Test error'); },
        configurable: true,
      });

      expect(detectBrowserLanguage()).toBeNull();
      expect(consoleWarn).toHaveBeenCalledWith(
        'Failed to detect browser language:',
        expect.any(Error)
      );

      consoleWarn.mockRestore();
    });
  });

  describe('getCurrentLanguage', () => {
    it('should return current i18n language if supported', () => {
      vi.spyOn(i18n, 'language', 'get').mockReturnValue('pt-BR');
      expect(getCurrentLanguage()).toBe('pt-BR');
    });

    it('should fallback to en-US if current language is not supported', () => {
      vi.spyOn(i18n, 'language', 'get').mockReturnValue('fr-FR');
      expect(getCurrentLanguage()).toBe('en-US');
    });
  });

  describe('changeLanguage', () => {
    beforeEach(() => {
      vi.spyOn(i18n, 'changeLanguage').mockResolvedValue();
    });

    it('should change language when supported', async () => {
      await expect(changeLanguage('pt-BR')).resolves.toBeUndefined();
      expect(i18n.changeLanguage).toHaveBeenCalledWith('pt-BR');
    });

    it('should throw error for unsupported language', async () => {
      // @ts-expect-error Testing invalid language
      await expect(changeLanguage('fr-FR')).rejects.toThrow('Unsupported language: fr-FR');
    });
  });

  describe('determineInitialLanguage', () => {
    it('should use saved preference if available', () => {
      vi.mocked(getLanguagePreference).mockReturnValue('pt-BR');

      expect(determineInitialLanguage()).toBe('pt-BR');
      expect(getLanguagePreference).toHaveBeenCalled();
    });

    it('should use browser language if no preference exists', () => {
      vi.mocked(getLanguagePreference).mockReturnValue(null);
      Object.defineProperty(window.navigator, 'language', {
        value: 'pt-BR',
        configurable: true,
      });

      expect(determineInitialLanguage()).toBe('pt-BR');
    });

    it('should map similar languages to supported ones', () => {
      vi.mocked(getLanguagePreference).mockReturnValue(null);
      Object.defineProperty(window.navigator, 'language', {
        value: 'pt-PT',
        configurable: true,
      });

      expect(determineInitialLanguage()).toBe('pt-BR');
    });

    it('should use default language if no supported language is found', () => {
      vi.mocked(getLanguagePreference).mockReturnValue(null);
      Object.defineProperty(window.navigator, 'language', {
        value: 'fr-FR',
        configurable: true,
      });

      expect(determineInitialLanguage()).toBe('en-US');
    });

    it('should handle errors gracefully', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(getLanguagePreference).mockImplementation(() => {
        throw new Error('Test error');
      });

      expect(determineInitialLanguage()).toBe('en-US');
      expect(consoleError).toHaveBeenCalledWith(
        'Error determining initial language:',
        expect.any(Error)
      );

      consoleError.mockRestore();
    });
  });

  describe('isRTLLanguage', () => {
    it('should identify RTL languages', () => {
      expect(isRTLLanguage('ar')).toBe(true);
      expect(isRTLLanguage('ar-SA')).toBe(true);
      expect(isRTLLanguage('he-IL')).toBe(true);
      expect(isRTLLanguage('fa')).toBe(true);
      expect(isRTLLanguage('ur')).toBe(true);
    });

    it('should identify LTR languages', () => {
      expect(isRTLLanguage('en-US')).toBe(false);
      expect(isRTLLanguage('pt-BR')).toBe(false);
      expect(isRTLLanguage('es')).toBe(false);
    });
  });

  describe('getTextDirection', () => {
    it('should return rtl for RTL languages', () => {
      expect(getTextDirection('ar-SA')).toBe('rtl');
      expect(getTextDirection('he')).toBe('rtl');
    });

    it('should return ltr for LTR languages', () => {
      expect(getTextDirection('en-US')).toBe('ltr');
      expect(getTextDirection('pt-BR')).toBe('ltr');
    });
  });
}); 