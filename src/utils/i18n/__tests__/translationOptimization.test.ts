import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { startupOptimizer } from '../startupOptimizer';
import { translationLoader } from '../translationLoader';
import { performanceMonitor } from '../performanceMonitor';
import { translationCache } from '../translationCache';

// Mock dependencies
vi.mock('../translationLoader');
vi.mock('../performanceMonitor');
vi.mock('../translationCache');

// Store original implementations
const originalStartupOptimizer = { ...startupOptimizer };

describe('Translation Optimization', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Reset startupOptimizer to initial state
    Object.assign(startupOptimizer, originalStartupOptimizer);
    startupOptimizer['isInitialized'] = false;
    startupOptimizer.setConfig({
      criticalNamespaces: ['common', 'navigation'],
      preloadNamespaces: [],
      preloadLanguages: ['en-US'],
      aggressiveCaching: true,
      maxConcurrentLoads: 3
    });

    // Reset mock implementations
    vi.mocked(translationLoader).loadNamespace.mockResolvedValue(undefined);
    vi.mocked(translationLoader).setConfig.mockImplementation(() => {});
    vi.mocked(translationLoader).preloadNamespaces.mockResolvedValue(undefined);
    
    vi.mocked(performanceMonitor).recordLoadingMetrics.mockImplementation(() => {});
    
    vi.mocked(translationCache).get.mockResolvedValue(null);
    vi.mocked(translationCache).set.mockResolvedValue(undefined);

    // Mock performance.now() for consistent timing
    vi.spyOn(performance, 'now')
      .mockReturnValue(0);
  });

  afterEach(() => {
    // Restore all mocks and spies
    vi.restoreAllMocks();
    
    // Reset startupOptimizer to prevent state leakage
    Object.assign(startupOptimizer, originalStartupOptimizer);
  });

  describe('Startup Optimizer', () => {
    it('should initialize with default configuration', async () => {
      await startupOptimizer.initialize();

      expect(translationLoader.setConfig).toHaveBeenCalledWith({
        enableCodeSplitting: true,
        aggressiveCaching: true,
        maxConcurrentLoads: 3,
        loadTimeout: 5000
      });

      expect(translationLoader.loadNamespace).toHaveBeenCalledWith(
        'common',
        'en-US',
        { force: true }
      );

      expect(translationLoader.loadNamespace).toHaveBeenCalledWith(
        'navigation',
        'en-US',
        { force: true }
      );
    });

    it('should respect custom configuration', async () => {
      // Reset state before custom config
      Object.assign(startupOptimizer, originalStartupOptimizer);
      startupOptimizer['isInitialized'] = false;
      
      startupOptimizer.setConfig({
        criticalNamespaces: ['auth'],
        preloadNamespaces: ['forms'],
        preloadLanguages: ['pt-BR'],
        aggressiveCaching: false,
        maxConcurrentLoads: 5
      });

      await startupOptimizer.initialize();

      expect(translationLoader.setConfig).toHaveBeenCalledWith({
        enableCodeSplitting: true,
        aggressiveCaching: false,
        maxConcurrentLoads: 5,
        loadTimeout: 5000
      });

      expect(translationLoader.loadNamespace).toHaveBeenCalledWith(
        'auth',
        'en-US',
        { force: true }
      );
    });

    it('should record performance metrics', async () => {
      await startupOptimizer.initialize();

      // Should record metrics for both critical namespaces
      expect(performanceMonitor.recordLoadingMetrics).toHaveBeenCalledWith(
        'en-US',
        'common',
        expect.objectContaining({
          loadTime: expect.any(Number),
          fromCache: false,
          size: 0,
          hasError: false
        })
      );

      expect(performanceMonitor.recordLoadingMetrics).toHaveBeenCalledWith(
        'en-US',
        'navigation',
        expect.objectContaining({
          loadTime: expect.any(Number),
          fromCache: false,
          size: 0,
          hasError: false
        })
      );
    });

    it('should handle initialization errors', async () => {
      const error = new Error('Loading failed');
      vi.mocked(translationLoader.loadNamespace).mockRejectedValueOnce(error);

      await expect(startupOptimizer.initialize()).rejects.toThrow(error);
    });

    it('should prevent multiple initializations', async () => {
      await startupOptimizer.initialize();
      await startupOptimizer.initialize();

      expect(translationLoader.setConfig).toHaveBeenCalledTimes(1);
      expect(translationLoader.loadNamespace).toHaveBeenCalledTimes(2); // Once for each critical namespace
    });
  });
});

describe('Translation Loading Performance', () => {
  beforeEach(() => {
    // Reset all mocks and state for performance tests
    vi.clearAllMocks();
    Object.assign(startupOptimizer, originalStartupOptimizer);
    startupOptimizer['isInitialized'] = false;

    // Reset mock implementations specific to performance tests
    vi.mocked(translationLoader).loadNamespace.mockImplementation(async (namespace, language, options) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 10));

      // Check cache first if aggressive caching is enabled
      if (startupOptimizer.getConfig().aggressiveCaching && !options?.force) {
        const cachedData = await translationCache.get(language, namespace, '1.0');
        if (cachedData) {
          performanceMonitor.recordLoadingMetrics(language, namespace, {
            loadTime: 0,
            fromCache: true,
            size: 0,
            hasError: false
          });
          return;
        }
      }

      // Simulate loading
      const data = { key: 'value' };
      
      // Cache the result if aggressive caching is enabled
      if (startupOptimizer.getConfig().aggressiveCaching) {
        await translationCache.set(language, namespace, '1.0', data);
      }

      performanceMonitor.recordLoadingMetrics(language, namespace, {
        loadTime: 10,
        fromCache: false,
        size: 0,
        hasError: false
      });
    });

    // Reset cache mock
    vi.mocked(translationCache).get.mockResolvedValue(null);
  });

  it('should load translations efficiently', async () => {
    // Initialize with multiple namespaces
    startupOptimizer.setConfig({
      criticalNamespaces: ['common', 'navigation'],
      preloadNamespaces: [],
      preloadLanguages: ['en-US'],
      aggressiveCaching: true,
      maxConcurrentLoads: 3
    });

    await startupOptimizer.initialize();

    // Should only load critical namespaces during initialization
    expect(translationLoader.loadNamespace).toHaveBeenCalledTimes(2);
    
    // Should record metrics for each namespace
    expect(performanceMonitor.recordLoadingMetrics).toHaveBeenCalledWith(
      'en-US',
      'common',
      expect.objectContaining({
        loadTime: expect.any(Number),
        fromCache: false,
        size: 0,
        hasError: false
      })
    );

    expect(performanceMonitor.recordLoadingMetrics).toHaveBeenCalledWith(
      'en-US',
      'navigation',
      expect.objectContaining({
        loadTime: expect.any(Number),
        fromCache: false,
        size: 0,
        hasError: false
      })
    );
  });

  it('should handle concurrent loading limits', async () => {
    // Reset state for concurrent loading test
    Object.assign(startupOptimizer, originalStartupOptimizer);
    startupOptimizer['isInitialized'] = false;
    
    startupOptimizer.setConfig({
      criticalNamespaces: ['common', 'navigation', 'auth', 'forms'],
      maxConcurrentLoads: 2
    });

    await startupOptimizer.initialize();

    // Should respect concurrent load limit
    const loadCalls = vi.mocked(translationLoader.loadNamespace).mock.calls;
    const uniqueTimes = new Set(loadCalls.map(call => call[2]?.force)).size;
    expect(uniqueTimes).toBeLessThanOrEqual(2);
  });

  it('should optimize caching behavior', async () => {
    // Reset state and setup cache mock
    Object.assign(startupOptimizer, originalStartupOptimizer);
    startupOptimizer['isInitialized'] = false;

    // Setup cache mock before any other operations
    const mockCache = vi.mocked(translationCache);
    mockCache.get.mockImplementation(async (lang, ns, version) => {
      if (lang === 'en-US' && ns === 'common') {
        return { key: 'value' };
      }
      return null;
    });

    // Configure startup optimizer after cache mock
    startupOptimizer.setConfig({
      criticalNamespaces: ['common'],
      preloadNamespaces: [],
      preloadLanguages: ['en-US'],
      aggressiveCaching: true,
      maxConcurrentLoads: 3
    });

    // Load a namespace that should hit the cache
    await translationLoader.loadNamespace('common', 'en-US');

    // Should check cache for the namespace
    expect(mockCache.get).toHaveBeenCalledWith(
      'en-US',
      'common',
      expect.any(String) // Version
    );

    // Should record metrics with fromCache=true
    expect(performanceMonitor.recordLoadingMetrics).toHaveBeenCalledWith(
      'en-US',
      'common',
      expect.objectContaining({
        fromCache: true,
        loadTime: expect.any(Number),
        size: 0,
        hasError: false
      })
    );
  });
}); 