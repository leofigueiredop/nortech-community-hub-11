import { SupportedLanguage } from '../i18n/supportedLanguages';
import { SupportedNamespaces } from '../i18n/types';

interface LoadingMetrics {
  loadTime: number;
  fromCache: boolean;
  size: number;
  hasError: boolean;
  timestamp: number;
}

interface NamespaceMetrics {
  namespace: SupportedNamespaces;
  language: SupportedLanguage;
  metrics: LoadingMetrics[];
  averageLoadTime: number;
  cacheHitRate: number;
  errorRate: number;
  totalLoads: number;
}

class PerformanceMonitorService {
  private metrics = new Map<string, NamespaceMetrics>();
  private readonly MAX_METRICS_PER_NAMESPACE = 100;

  /**
   * Records metrics for a namespace loading event
   */
  public recordLoadingMetrics(
    language: SupportedLanguage,
    namespace: SupportedNamespaces,
    metrics: Omit<LoadingMetrics, 'timestamp'>
  ): void {
    const key = `${language}:${namespace}`;
    const timestamp = Date.now();
    const loadingMetric: LoadingMetrics = { ...metrics, timestamp };

    let namespaceMetrics = this.metrics.get(key);
    if (!namespaceMetrics) {
      namespaceMetrics = {
        namespace,
        language,
        metrics: [],
        averageLoadTime: 0,
        cacheHitRate: 0,
        errorRate: 0,
        totalLoads: 0,
      };
      this.metrics.set(key, namespaceMetrics);
    }

    // Add new metric
    namespaceMetrics.metrics.push(loadingMetric);

    // Keep only the most recent metrics
    if (namespaceMetrics.metrics.length > this.MAX_METRICS_PER_NAMESPACE) {
      namespaceMetrics.metrics = namespaceMetrics.metrics.slice(-this.MAX_METRICS_PER_NAMESPACE);
    }

    // Update aggregate statistics
    this.updateAggregateStats(namespaceMetrics);

    // Log metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Translation Performance Metrics:', {
        language,
        namespace,
        ...metrics,
      });
    }
  }

  /**
   * Gets performance statistics for a specific namespace and language
   */
  public getNamespaceStats(language: SupportedLanguage, namespace: SupportedNamespaces) {
    const key = `${language}:${namespace}`;
    return this.metrics.get(key);
  }

  /**
   * Gets overall performance statistics across all namespaces
   */
  public getOverallStats() {
    const stats = {
      totalNamespaces: this.metrics.size,
      averageLoadTime: 0,
      overallCacheHitRate: 0,
      overallErrorRate: 0,
      totalLoads: 0,
      namespacesByLoadTime: [] as Array<{
        namespace: SupportedNamespaces;
        language: SupportedLanguage;
        averageLoadTime: number;
      }>,
      slowestLoads: [] as Array<{
        namespace: SupportedNamespaces;
        language: SupportedLanguage;
        loadTime: number;
        timestamp: number;
      }>,
    };

    if (this.metrics.size === 0) {
      return stats;
    }

    let totalLoadTime = 0;
    let totalCacheHits = 0;
    let totalErrors = 0;
    let totalMetrics = 0;

    // Collect metrics for sorting
    const namespaceLoadTimes: Array<{
      namespace: SupportedNamespaces;
      language: SupportedLanguage;
      averageLoadTime: number;
    }> = [];

    const allLoadTimes: Array<{
      namespace: SupportedNamespaces;
      language: SupportedLanguage;
      loadTime: number;
      timestamp: number;
    }> = [];

    for (const [, nsMetrics] of this.metrics) {
      totalLoadTime += nsMetrics.averageLoadTime * nsMetrics.totalLoads;
      totalCacheHits += nsMetrics.metrics.filter(m => m.fromCache).length;
      totalErrors += nsMetrics.metrics.filter(m => m.hasError).length;
      totalMetrics += nsMetrics.metrics.length;

      namespaceLoadTimes.push({
        namespace: nsMetrics.namespace,
        language: nsMetrics.language,
        averageLoadTime: nsMetrics.averageLoadTime,
      });

      // Collect all load times for finding slowest loads
      nsMetrics.metrics.forEach(metric => {
        allLoadTimes.push({
          namespace: nsMetrics.namespace,
          language: nsMetrics.language,
          loadTime: metric.loadTime,
          timestamp: metric.timestamp,
        });
      });
    }

    // Calculate overall statistics
    stats.averageLoadTime = totalLoadTime / totalMetrics;
    stats.overallCacheHitRate = (totalCacheHits / totalMetrics) * 100;
    stats.overallErrorRate = (totalErrors / totalMetrics) * 100;
    stats.totalLoads = totalMetrics;

    // Sort namespaces by average load time
    stats.namespacesByLoadTime = namespaceLoadTimes
      .sort((a, b) => b.averageLoadTime - a.averageLoadTime)
      .slice(0, 5); // Top 5 slowest namespaces

    // Get top 5 slowest individual loads
    stats.slowestLoads = allLoadTimes
      .sort((a, b) => b.loadTime - a.loadTime)
      .slice(0, 5);

    return stats;
  }

  /**
   * Updates aggregate statistics for a namespace
   */
  private updateAggregateStats(namespaceMetrics: NamespaceMetrics): void {
    const metrics = namespaceMetrics.metrics;
    const totalLoads = metrics.length;

    if (totalLoads === 0) return;

    // Calculate averages and rates
    const totalLoadTime = metrics.reduce((sum, m) => sum + m.loadTime, 0);
    const cacheHits = metrics.filter(m => m.fromCache).length;
    const errors = metrics.filter(m => m.hasError).length;

    namespaceMetrics.averageLoadTime = totalLoadTime / totalLoads;
    namespaceMetrics.cacheHitRate = (cacheHits / totalLoads) * 100;
    namespaceMetrics.errorRate = (errors / totalLoads) * 100;
    namespaceMetrics.totalLoads = totalLoads;
  }

  /**
   * Clears all recorded metrics
   */
  public clearMetrics(): void {
    this.metrics.clear();
  }
}

// Export a singleton instance
export const performanceMonitor = new PerformanceMonitorService(); 