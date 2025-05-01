import { LanguageChangeEvent } from '../i18n/languageService';

interface LanguageMetrics {
  detectionSource: 'preference' | 'browser' | 'default';
  requestedLanguage: string;
  appliedLanguage: string;
  fallbackUsed: boolean;
  timestamp: number;
}

class LanguageTelemetryService {
  private metrics: LanguageMetrics[] = [];
  private readonly MAX_METRICS = 100;

  /**
   * Records a language change event
   */
  public recordLanguageChange(
    event: LanguageChangeEvent,
    source: 'preference' | 'browser' | 'default'
  ): void {
    const metric: LanguageMetrics = {
      detectionSource: source,
      requestedLanguage: event.requestedLanguage || event.newLanguage,
      appliedLanguage: event.newLanguage,
      fallbackUsed: event.fallbackUsed,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    // Keep only the most recent metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    // Log metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Language Telemetry:', metric);
    }
  }

  /**
   * Gets statistics about language detection and fallback usage
   */
  public getStatistics() {
    const total = this.metrics.length;
    if (total === 0) {
      return {
        total: 0,
        fallbackRate: 0,
        detectionSources: { preference: 0, browser: 0, default: 0 },
        mostRequestedLanguages: [],
        mostAppliedLanguages: [],
      };
    }

    // Calculate fallback rate
    const fallbackCount = this.metrics.filter(m => m.fallbackUsed).length;
    const fallbackRate = (fallbackCount / total) * 100;

    // Count detection sources
    const detectionSources = this.metrics.reduce(
      (acc, metric) => {
        acc[metric.detectionSource]++;
        return acc;
      },
      { preference: 0, browser: 0, default: 0 }
    );

    // Get most requested languages
    const requestedLanguages = this.getTopLanguages(
      this.metrics.map(m => m.requestedLanguage)
    );

    // Get most applied languages
    const appliedLanguages = this.getTopLanguages(
      this.metrics.map(m => m.appliedLanguage)
    );

    return {
      total,
      fallbackRate,
      detectionSources,
      mostRequestedLanguages: requestedLanguages,
      mostAppliedLanguages: appliedLanguages,
    };
  }

  /**
   * Gets the top languages and their frequencies
   */
  private getTopLanguages(languages: string[]): Array<{ language: string; count: number }> {
    const counts = languages.reduce((acc, lang) => {
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 languages
  }

  /**
   * Clears all recorded metrics
   */
  public clearMetrics(): void {
    this.metrics = [];
  }
}

// Export a singleton instance
export const languageTelemetry = new LanguageTelemetryService(); 