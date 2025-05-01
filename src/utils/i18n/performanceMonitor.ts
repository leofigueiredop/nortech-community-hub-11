import { SupportedLanguage } from './supportedLanguages';
import { SupportedNamespaces } from './types';

/**
 * Performance metrics for translation loading
 */
interface LoadingMetrics {
  /** Time taken to load the translation (ms) */
  loadTime: number;
  /** Whether the translation was loaded from cache */
  fromCache: boolean;
  /** Size of the translation data (bytes) */
  size: number;
  /** Whether there were any errors during loading */
  hasError: boolean;
  /** Timestamp of the loading event */
  timestamp: number;
}

/**
 * Usage metrics for translation namespaces
 */
interface UsageMetrics {
  /** Number of times the namespace was accessed */
  accessCount: number;
  /** Last access timestamp */
  lastAccess: number;
  /** Average load time (ms) */
  avgLoadTime: number;
  /** Error rate (0-1) */
  errorRate: number;
  /** Cache hit rate (0-1) */
  cacheHitRate: number;
}

/**
 * Performance monitor for translation loading
 */
class PerformanceMonitor {
  private readonly METRICS_KEY = 'translation-metrics';
  private readonly USAGE_KEY = 'translation-usage';
  private readonly MAX_METRICS_PER_NS = 100;
  
  private loadingMetrics = new Map<string, LoadingMetrics[]>();
  private usageMetrics = new Map<string, UsageMetrics>();
  
  constructor() {
    this.loadFromStorage();
    this.setupPeriodicCleanup();
  }
  
  /**
   * Record metrics for a translation loading event
   */
  recordLoadingMetrics(
    language: SupportedLanguage,
    namespace: SupportedNamespaces,
    metrics: Omit<LoadingMetrics, 'timestamp'>
  ): void {
    const key = this.getKey(language, namespace);
    const timestamp = Date.now();
    
    // Get or initialize metrics array
    const nsMetrics = this.loadingMetrics.get(key) || [];
    
    // Add new metrics
    nsMetrics.push({ ...metrics, timestamp });
    
    // Keep only the most recent metrics
    if (nsMetrics.length > this.MAX_METRICS_PER_NS) {
      nsMetrics.shift();
    }
    
    this.loadingMetrics.set(key, nsMetrics);
    
    // Update usage metrics
    this.updateUsageMetrics(key, metrics);
    
    // Save to storage
    this.saveToStorage();
  }
  
  /**
   * Get loading metrics for a namespace
   */
  getLoadingMetrics(language: SupportedLanguage, namespace: SupportedNamespaces): LoadingMetrics[] {
    const key = this.getKey(language, namespace);
    return this.loadingMetrics.get(key) || [];
  }
  
  /**
   * Get usage metrics for a namespace
   */
  getUsageMetrics(language: SupportedLanguage, namespace: SupportedNamespaces): UsageMetrics | null {
    const key = this.getKey(language, namespace);
    return this.usageMetrics.get(key) || null;
  }
  
  /**
   * Get the most frequently used namespaces
   */
  getMostUsedNamespaces(limit: number = 10): Array<{ namespace: string; metrics: UsageMetrics }> {
    return Array.from(this.usageMetrics.entries())
      .sort(([, a], [, b]) => b.accessCount - a.accessCount)
      .slice(0, limit)
      .map(([key, metrics]) => ({
        namespace: key,
        metrics
      }));
  }
  
  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.loadingMetrics.clear();
    this.usageMetrics.clear();
    this.saveToStorage();
  }
  
  /**
   * Generate a performance report
   */
  generateReport(): string {
    let report = '=== Translation Performance Report ===\n\n';
    
    // Overall statistics
    const totalAccesses = Array.from(this.usageMetrics.values())
      .reduce((sum, metrics) => sum + metrics.accessCount, 0);
    
    const avgLoadTime = Array.from(this.usageMetrics.values())
      .reduce((sum, metrics) => sum + metrics.avgLoadTime, 0) / this.usageMetrics.size;
    
    const avgCacheHitRate = Array.from(this.usageMetrics.values())
      .reduce((sum, metrics) => sum + metrics.cacheHitRate, 0) / this.usageMetrics.size;
    
    report += `Total Accesses: ${totalAccesses}\n`;
    report += `Average Load Time: ${avgLoadTime.toFixed(2)}ms\n`;
    report += `Average Cache Hit Rate: ${(avgCacheHitRate * 100).toFixed(2)}%\n\n`;
    
    // Most used namespaces
    report += '=== Most Used Namespaces ===\n\n';
    this.getMostUsedNamespaces(5).forEach(({ namespace, metrics }) => {
      report += `${namespace}:\n`;
      report += `  Accesses: ${metrics.accessCount}\n`;
      report += `  Avg Load Time: ${metrics.avgLoadTime.toFixed(2)}ms\n`;
      report += `  Cache Hit Rate: ${(metrics.cacheHitRate * 100).toFixed(2)}%\n`;
      report += `  Error Rate: ${(metrics.errorRate * 100).toFixed(2)}%\n\n`;
    });
    
    return report;
  }
  
  /**
   * Update usage metrics for a namespace
   */
  private updateUsageMetrics(key: string, metrics: Omit<LoadingMetrics, 'timestamp'>): void {
    const existing = this.usageMetrics.get(key) || {
      accessCount: 0,
      lastAccess: 0,
      avgLoadTime: 0,
      errorRate: 0,
      cacheHitRate: 0
    };
    
    // Update metrics
    const newMetrics: UsageMetrics = {
      accessCount: existing.accessCount + 1,
      lastAccess: Date.now(),
      avgLoadTime: (existing.avgLoadTime * existing.accessCount + metrics.loadTime) / (existing.accessCount + 1),
      errorRate: (existing.errorRate * existing.accessCount + (metrics.hasError ? 1 : 0)) / (existing.accessCount + 1),
      cacheHitRate: (existing.cacheHitRate * existing.accessCount + (metrics.fromCache ? 1 : 0)) / (existing.accessCount + 1)
    };
    
    this.usageMetrics.set(key, newMetrics);
  }
  
  /**
   * Generate a key for a language/namespace pair
   */
  private getKey(language: SupportedLanguage, namespace: SupportedNamespaces): string {
    return `${language}:${namespace}`;
  }
  
  /**
   * Save metrics to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.METRICS_KEY, JSON.stringify(Array.from(this.loadingMetrics.entries())));
      localStorage.setItem(this.USAGE_KEY, JSON.stringify(Array.from(this.usageMetrics.entries())));
    } catch (error) {
      console.warn('Failed to save translation metrics:', error);
    }
  }
  
  /**
   * Load metrics from localStorage
   */
  private loadFromStorage(): void {
    try {
      const metricsData = localStorage.getItem(this.METRICS_KEY);
      const usageData = localStorage.getItem(this.USAGE_KEY);
      
      if (metricsData) {
        this.loadingMetrics = new Map(JSON.parse(metricsData));
      }
      
      if (usageData) {
        this.usageMetrics = new Map(JSON.parse(usageData));
      }
    } catch (error) {
      console.warn('Failed to load translation metrics:', error);
    }
  }
  
  /**
   * Set up periodic cleanup of old metrics
   */
  private setupPeriodicCleanup(): void {
    const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
    const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    setInterval(() => {
      const now = Date.now();
      
      // Clean up loading metrics
      for (const [key, metrics] of this.loadingMetrics.entries()) {
        const filtered = metrics.filter(m => now - m.timestamp < MAX_AGE);
        if (filtered.length !== metrics.length) {
          this.loadingMetrics.set(key, filtered);
        }
      }
      
      // Clean up usage metrics for unused namespaces
      for (const [key, metrics] of this.usageMetrics.entries()) {
        if (now - metrics.lastAccess > MAX_AGE) {
          this.usageMetrics.delete(key);
        }
      }
      
      this.saveToStorage();
    }, CLEANUP_INTERVAL);
  }
}

export const performanceMonitor = new PerformanceMonitor(); 