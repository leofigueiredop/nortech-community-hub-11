import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TranslationCache, CacheConfig } from '../translationCache';
import { SupportedLanguage } from '../supportedLanguages';
import { SupportedNamespaces } from '../types';

describe('TranslationCache', () => {
  let cache: TranslationCache;
  const version = '1.0.0';

  // Mock IndexedDB
  const mockIndexedDB = {
    open: vi.fn(),
    deleteDatabase: vi.fn()
  };

  const mockIDBRequest = {
    result: {
      transaction: vi.fn(),
      createObjectStore: vi.fn(),
      close: vi.fn()
    },
    onsuccess: null as any,
    onerror: null as any,
    onupgradeneeded: null as any
  };

  const mockObjectStore = {
    put: vi.fn(),
    get: vi.fn(),
    createIndex: vi.fn(),
    index: vi.fn().mockReturnValue({
      openCursor: vi.fn()
    })
  };

  const mockTransaction = {
    objectStore: vi.fn().mockReturnValue(mockObjectStore),
    oncomplete: null as any
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup IndexedDB mock
    global.indexedDB = mockIndexedDB as any;
    mockIndexedDB.open.mockReturnValue(mockIDBRequest);
    mockIDBRequest.result.transaction = vi.fn().mockReturnValue(mockTransaction);

    // Create cache instance
    cache = new TranslationCache();

    // Initialize cache
    mockIndexedDB.open.mockImplementation(() => {
      setTimeout(() => {
        mockIDBRequest.onsuccess?.({ target: mockIDBRequest } as any);
      }, 0);
      return mockIDBRequest;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('basic operations', () => {
    it('initializes successfully', async () => {
      await cache.init();
      expect(mockIndexedDB.open).toHaveBeenCalled();
    });

    it('stores translations in IndexedDB', async () => {
      const data = { key: 'Test Value' };
      await cache.init();
      await cache.set('en-US' as SupportedLanguage, 'common' as SupportedNamespaces, version, data);
      
      expect(mockObjectStore.put).toHaveBeenCalled();
      const putArgs = mockObjectStore.put.mock.calls[0][0];
      expect(putArgs.data).toEqual(data);
    });

    it('retrieves translations from IndexedDB', async () => {
      const data = { key: 'Test Value' };
      mockObjectStore.get.mockImplementation((key) => {
        const request = {
          onsuccess: null,
          result: {
            data,
            timestamp: Date.now(),
            version,
            size: 100
          }
        };
        setTimeout(() => {
          request.onsuccess?.({ target: request } as any);
        }, 0);
        return request;
      });

      await cache.init();
      const result = await cache.get('en-US' as SupportedLanguage, 'common' as SupportedNamespaces, version);
      
      expect(result).toEqual(data);
    });

    it('handles missing translations', async () => {
      mockObjectStore.get.mockImplementation(() => {
        const request = {
          onsuccess: null,
          result: undefined
        };
        setTimeout(() => {
          request.onsuccess?.({ target: request } as any);
        }, 0);
        return request;
      });

      await cache.init();
      const result = await cache.get('en-US' as SupportedLanguage, 'common' as SupportedNamespaces, version);
      
      expect(result).toBeNull();
    });
  });

  describe('configuration', () => {
    it('updates cache configuration', async () => {
      const newConfig: Partial<CacheConfig> = {
        ttl: 3600,
        maxSize: 1024 * 1024,
        offlineSupport: false
      };

      cache.updateConfig(newConfig);
      await cache.init();

      // Test storing data larger than maxSize
      const largeData = { key: 'x'.repeat(2 * 1024 * 1024) }; // 2MB data
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      await cache.set('en-US' as SupportedLanguage, 'common' as SupportedNamespaces, version, largeData);
      
      expect(consoleSpy).toHaveBeenCalledWith('Translation data exceeds maximum cache size');
      consoleSpy.mockRestore();
    });
  });

  describe('cleanup', () => {
    it('removes expired entries', async () => {
      const mockCursor = {
        value: {
          timestamp: Date.now() - 1000000,
          version: 'old-version',
          data: { key: 'old value' }
        },
        delete: vi.fn(),
        continue: vi.fn()
      };

      mockObjectStore.index().openCursor.mockImplementation(() => {
        const request = {
          onsuccess: null,
          result: mockCursor
        };
        setTimeout(() => {
          request.onsuccess?.({ target: request } as any);
          // Simulate end of cursor
          request.result = null;
          request.onsuccess?.({ target: request } as any);
        }, 0);
        return request;
      });

      await cache.init();
      await cache.cleanup();

      expect(mockCursor.delete).toHaveBeenCalled();
    });
  });
}); 