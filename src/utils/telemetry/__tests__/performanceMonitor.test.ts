import { describe, it, expect, beforeEach, vi } from 'vitest';
import { performanceMonitor } from '../performanceMonitor';
import type { SupportedLanguage } from '../../i18n/supportedLanguages';
import type { SupportedNamespaces } from '../../i18n/types';

describe('PerformanceMonitorService', () => {
  beforeEach(() => {
    // Clear metrics before each test
    performanceMonitor.clearMetrics();
    // Mock console.log
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('recordLoadingMetrics', () => {
    it('should record loading metrics for a namespace', () => {
      const metrics = {
        loadTime: 100,
        fromCache: false,
        size: 1024,
        hasError: false
      };

      performanceMonitor.recordLoadingMetrics('en-US' as SupportedLanguage, 'common' as SupportedNamespaces, metrics);
      const stats = performanceMonitor.getNamespaceStats('en-US' as SupportedLanguage, 'common' as SupportedNamespaces);

      expect(stats).toBeDefined();
      expect(stats?.averageLoadTime).toBe(100);
      expect(stats?.cacheHitRate).toBe(0);
      expect(stats?.errorRate).toBe(0);
      expect(stats?.totalLoads).toBe(1);
    });

    it('should calculate correct cache hit rate', () => {
      const baseMetrics = {
        loadTime: 100,
        size: 1024,
        hasError: false
      };

      // Record mix of cache hits and misses
      performanceMonitor.recordLoadingMetrics('en-US' as SupportedLanguage, 'common' as SupportedNamespaces, {
        ...baseMetrics,
        fromCache: true
      });

      performanceMonitor.recordLoadingMetrics('en-US' as SupportedLanguage, 'common' as SupportedNamespaces, {
        ...baseMetrics,
        fromCache: true
      });

      performanceMonitor.recordLoadingMetrics('en-US' as SupportedLanguage, 'common' as SupportedNamespaces, {
        ...baseMetrics,
        fromCache: false
      });

      const stats = performanceMonitor.getNamespaceStats('en-US' as SupportedLanguage, 'common' as SupportedNamespaces);
      expect(stats?.cacheHitRate).toBe((2 / 3) * 100); // 66.67%
    });

    it('should calculate correct error rate', () => {
      const baseMetrics = {
        loadTime: 100,
        size: 1024,
        fromCache: false
      };

      // Record mix of successful and failed loads
      performanceMonitor.recordLoadingMetrics('en-US' as SupportedLanguage, 'common' as SupportedNamespaces, {
        ...baseMetrics,
        hasError: true
      });

      performanceMonitor.recordLoadingMetrics('en-US' as SupportedLanguage, 'common' as SupportedNamespaces, {
        ...baseMetrics,
        hasError: false
      });

      performanceMonitor.recordLoadingMetrics('en-US' as SupportedLanguage, 'common' as SupportedNamespaces, {
        ...baseMetrics,
        hasError: true
      });

      const stats = performanceMonitor.getNamespaceStats('en-US' as SupportedLanguage, 'common' as SupportedNamespaces);
      expect(stats?.errorRate).toBe((2 / 3) * 100); // 66.67%
    });

    it('should limit the number of stored metrics per namespace', () => {
      const metrics = {
        loadTime: 100,
        fromCache: false,
        size: 1024,
        hasError: false
      };

      // Record more metrics than the limit
      for (let i = 0; i < 150; i++) {
        performanceMonitor.recordLoadingMetrics('en-US' as SupportedLanguage, 'common' as SupportedNamespaces, metrics);
      }

      const stats = performanceMonitor.getNamespaceStats('en-US' as SupportedLanguage, 'common' as SupportedNamespaces);
      expect(stats?.metrics.length).toBe(100); // MAX_METRICS_PER_NAMESPACE is 100
    });
  });

  describe('getOverallStats', () => {
    it('should return empty stats when no metrics are recorded', () => {
      const stats = performanceMonitor.getOverallStats();

      expect(stats).toEqual({
        totalNamespaces: 0,
        averageLoadTime: 0,
        overallCacheHitRate: 0,
        overallErrorRate: 0,
        totalLoads: 0,
        namespacesByLoadTime: [],
        slowestLoads: []
      });
    });

    it('should calculate correct overall statistics', () => {
      const baseMetrics = {
        size: 1024,
        fromCache: false,
        hasError: false
      };

      // Record metrics for multiple namespaces
      performanceMonitor.recordLoadingMetrics('en-US' as SupportedLanguage, 'common' as SupportedNamespaces, {
        ...baseMetrics,
        loadTime: 100
      });

      performanceMonitor.recordLoadingMetrics('en-US' as SupportedLanguage, 'forms' as SupportedNamespaces, {
        ...baseMetrics,
        loadTime: 200
      });

      performanceMonitor.recordLoadingMetrics('en-US' as SupportedLanguage, 'auth' as SupportedNamespaces, {
        ...baseMetrics,
        loadTime: 300
      });

      const stats = performanceMonitor.getOverallStats();

      expect(stats.totalNamespaces).toBe(3);
      expect(stats.averageLoadTime).toBe(200); // (100 + 200 + 300) / 3
      expect(stats.namespacesByLoadTime.length).toBe(3);
      expect(stats.namespacesByLoadTime[0].averageLoadTime).toBe(300); // auth namespace should be slowest
      expect(stats.slowestLoads.length).toBe(3);
      expect(stats.slowestLoads[0].loadTime).toBe(300); // slowest individual load
    });
  });
}); 