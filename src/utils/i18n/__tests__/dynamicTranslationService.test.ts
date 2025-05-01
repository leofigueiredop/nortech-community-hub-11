import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DynamicTranslationServiceImpl, DynamicTranslationError, DynamicTranslationConfig } from '../dynamicTranslationService';
import { DynamicTranslationApiClient } from '../dynamicTranslationApiClient';
import { languageService } from '../languageService';
import { translationCache } from '../translationCache';

// Mock the language service
vi.mock('../languageService', () => ({
  languageService: {
    getCurrentLanguage: vi.fn().mockReturnValue('en-US'),
    on: vi.fn(),
    off: vi.fn(),
  }
}));

// Mock the translation cache
vi.mock('../translationCache', () => ({
  translationCache: {
    get: vi.fn(),
    set: vi.fn(),
    cleanup: vi.fn(),
    updateConfig: vi.fn(),
  }
}));

describe('DynamicTranslationService', () => {
  let apiClient: DynamicTranslationApiClient;
  let service: DynamicTranslationServiceImpl;
  const version = '1.0';

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Create a mock API client
    apiClient = {
      fetchTranslations: vi.fn(),
    } as unknown as DynamicTranslationApiClient;

    // Create service instance with config
    const config: DynamicTranslationConfig = {
      apiConfig: {
        endpoint: 'mock://api',
        batchSize: 50,
        throttleMs: 1000,
        timeoutMs: 5000,
        retryEnabled: true,
        maxRetries: 3,
        retryDelayMs: 1000
      }
    };

    service = new DynamicTranslationServiceImpl(config);
  });

  describe('translateDynamic', () => {
    it('returns cached translation if available', async () => {
      // Set up cache with a translation
      const key = 'test.key';
      const translation = 'Test Translation';
      (translationCache.get as jest.Mock).mockResolvedValue({ [key]: translation });

      const result = await service.translateDynamic(key);
      expect(result).toBe(translation);
      expect(apiClient.fetchTranslations).not.toHaveBeenCalled();
    });

    it('fetches and caches new translations', async () => {
      const key = 'test.key';
      const translation = 'Test Translation';
      (translationCache.get as jest.Mock).mockResolvedValue(null);
      (apiClient.fetchTranslations as jest.Mock).mockResolvedValue({ [key]: translation });

      const result = await service.translateDynamic(key);
      expect(result).toBe(translation);
      expect(apiClient.fetchTranslations).toHaveBeenCalledWith([key], 'en-US');
      expect(translationCache.set).toHaveBeenCalledWith('en-US', 'common', version, { [key]: translation });
    });

    it('handles parameter interpolation', async () => {
      const key = 'test.key';
      const translation = 'Hello {{name}}!';
      const params = { name: 'John' };
      (translationCache.get as jest.Mock).mockResolvedValue({ [key]: translation });

      const result = await service.translateDynamic(key, undefined, params);
      expect(result).toBe('Hello John!');
    });

    it('falls back to en-US when translation is missing', async () => {
      const key = 'test.key';
      const translation = 'English Translation';
      (languageService.getCurrentLanguage as jest.Mock).mockReturnValue('pt-BR');
      (translationCache.get as jest.Mock).mockResolvedValue(null);
      (apiClient.fetchTranslations as jest.Mock)
        .mockResolvedValueOnce({}) // No pt-BR translation
        .mockResolvedValueOnce({ [key]: translation }); // en-US translation

      const result = await service.translateDynamic(key);
      expect(result).toBe(translation);
      expect(apiClient.fetchTranslations).toHaveBeenCalledTimes(2);
      expect(apiClient.fetchTranslations).toHaveBeenCalledWith([key], 'pt-BR');
      expect(apiClient.fetchTranslations).toHaveBeenCalledWith([key], 'en-US');
    });

    it('uses fallback text when translation is not found', async () => {
      const key = 'test.key';
      const fallback = 'Fallback Text';
      (translationCache.get as jest.Mock).mockResolvedValue(null);
      (apiClient.fetchTranslations as jest.Mock)
        .mockResolvedValue({}); // No translation found

      const result = await service.translateDynamic(key, fallback);
      expect(result).toBe(fallback);
    });

    it('uses key as last resort when no translation or fallback is available', async () => {
      const key = 'test.key';
      (translationCache.get as jest.Mock).mockResolvedValue(null);
      (apiClient.fetchTranslations as jest.Mock)
        .mockResolvedValue({}); // No translation found

      const result = await service.translateDynamic(key);
      expect(result).toBe(key);
    });

    it('handles API errors gracefully', async () => {
      const key = 'test.key';
      const fallback = 'Fallback Text';
      (translationCache.get as jest.Mock).mockResolvedValue(null);
      (apiClient.fetchTranslations as jest.Mock)
        .mockRejectedValue(new Error('API Error'));

      const result = await service.translateDynamic(key, fallback);
      expect(result).toBe(fallback);
    });
  });

  describe('preloadDynamicTranslations', () => {
    it('fetches and caches multiple translations', async () => {
      const keys = ['key1', 'key2'];
      const translations = {
        key1: 'Translation 1',
        key2: 'Translation 2',
      };
      (translationCache.get as jest.Mock).mockResolvedValue(null);
      (apiClient.fetchTranslations as jest.Mock).mockResolvedValue(translations);

      await service.preloadDynamicTranslations(keys);

      expect(apiClient.fetchTranslations).toHaveBeenCalledWith(keys, 'en-US');
      expect(translationCache.set).toHaveBeenCalledWith('en-US', 'common', version, translations);
    });

    it('handles partial translation results', async () => {
      const keys = ['key1', 'key2'];
      const translations = {
        key1: 'Translation 1',
        // key2 is missing
      };
      (translationCache.get as jest.Mock).mockResolvedValue(null);
      (apiClient.fetchTranslations as jest.Mock).mockResolvedValue(translations);

      await service.preloadDynamicTranslations(keys);

      expect(translationCache.set).toHaveBeenCalledWith('en-US', 'common', version, translations);
    });

    it('throws DynamicTranslationError on API failure', async () => {
      const keys = ['key1', 'key2'];
      const error = new Error('API Error');
      (translationCache.get as jest.Mock).mockResolvedValue(null);
      (apiClient.fetchTranslations as jest.Mock).mockRejectedValue(error);

      await expect(service.preloadDynamicTranslations(keys))
        .rejects
        .toThrow(DynamicTranslationError);
    });
  });

  describe('cache management', () => {
    it('clears cache', () => {
      service.clearCache();
      expect(translationCache.cleanup).toHaveBeenCalled();
    });

    it('handles language changes', () => {
      // Get the callback that was registered
      const callback = (languageService.on as jest.Mock).mock.calls[0][1];

      // Simulate language change
      callback();

      expect(translationCache.cleanup).toHaveBeenCalled();
    });
  });
}); 