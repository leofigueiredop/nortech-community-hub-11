import { describe, it, expect, beforeEach, vi } from 'vitest';
import { languageTelemetry } from '../languageTelemetry';
import type { LanguageChangeEvent } from '../../i18n/languageService';

describe('LanguageTelemetryService', () => {
  beforeEach(() => {
    // Clear metrics before each test
    languageTelemetry.clearMetrics();
    // Mock console.log
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('recordLanguageChange', () => {
    it('should record language change events', () => {
      const event: LanguageChangeEvent = {
        previousLanguage: 'en-US',
        newLanguage: 'pt-BR',
        fallbackUsed: false,
      };

      languageTelemetry.recordLanguageChange(event, 'preference');
      const stats = languageTelemetry.getStatistics();

      expect(stats.total).toBe(1);
      expect(stats.fallbackRate).toBe(0);
      expect(stats.detectionSources.preference).toBe(1);
    });

    it('should handle fallback cases', () => {
      const event: LanguageChangeEvent = {
        previousLanguage: 'en-US',
        newLanguage: 'pt-BR',
        requestedLanguage: 'pt-PT',
        fallbackUsed: true,
      };

      languageTelemetry.recordLanguageChange(event, 'browser');
      const stats = languageTelemetry.getStatistics();

      expect(stats.fallbackRate).toBe(100);
      expect(stats.detectionSources.browser).toBe(1);
      expect(stats.mostRequestedLanguages[0]).toEqual({
        language: 'pt-PT',
        count: 1,
      });
      expect(stats.mostAppliedLanguages[0]).toEqual({
        language: 'pt-BR',
        count: 1,
      });
    });

    it('should limit the number of stored metrics', () => {
      const event: LanguageChangeEvent = {
        previousLanguage: 'en-US',
        newLanguage: 'pt-BR',
        fallbackUsed: false,
      };

      // Record more events than the limit
      for (let i = 0; i < 150; i++) {
        languageTelemetry.recordLanguageChange(event, 'preference');
      }

      const stats = languageTelemetry.getStatistics();
      expect(stats.total).toBe(100); // MAX_METRICS is 100
    });
  });

  describe('getStatistics', () => {
    it('should return empty statistics when no metrics are recorded', () => {
      const stats = languageTelemetry.getStatistics();

      expect(stats).toEqual({
        total: 0,
        fallbackRate: 0,
        detectionSources: { preference: 0, browser: 0, default: 0 },
        mostRequestedLanguages: [],
        mostAppliedLanguages: [],
      });
    });

    it('should calculate correct statistics for multiple events', () => {
      // Record multiple events with different sources and languages
      const events: Array<[LanguageChangeEvent, 'preference' | 'browser' | 'default']> = [
        [{
          previousLanguage: 'en-US',
          newLanguage: 'pt-BR',
          fallbackUsed: false,
        }, 'preference'],
        [{
          previousLanguage: 'pt-BR',
          newLanguage: 'en-US',
          fallbackUsed: false,
        }, 'browser'],
        [{
          previousLanguage: 'en-US',
          newLanguage: 'pt-BR',
          requestedLanguage: 'pt-PT',
          fallbackUsed: true,
        }, 'browser'],
        [{
          previousLanguage: 'pt-BR',
          newLanguage: 'en-US',
          fallbackUsed: false,
        }, 'default'],
      ];

      events.forEach(([event, source]) => {
        languageTelemetry.recordLanguageChange(event, source);
      });

      const stats = languageTelemetry.getStatistics();

      expect(stats.total).toBe(4);
      expect(stats.fallbackRate).toBe(25); // 1 out of 4 used fallback
      expect(stats.detectionSources).toEqual({
        preference: 1,
        browser: 2,
        default: 1,
      });
    });

    it('should return top languages correctly', () => {
      // Record events with various languages
      const events: Array<[LanguageChangeEvent, 'preference' | 'browser' | 'default']> = [
        [{
          previousLanguage: 'en-US',
          newLanguage: 'pt-BR',
          requestedLanguage: 'pt-PT',
          fallbackUsed: true,
        }, 'browser'],
        [{
          previousLanguage: 'pt-BR',
          newLanguage: 'en-US',
          requestedLanguage: 'en-GB',
          fallbackUsed: true,
        }, 'browser'],
        [{
          previousLanguage: 'en-US',
          newLanguage: 'pt-BR',
          requestedLanguage: 'pt-PT',
          fallbackUsed: true,
        }, 'preference'],
      ];

      events.forEach(([event, source]) => {
        languageTelemetry.recordLanguageChange(event, source);
      });

      const stats = languageTelemetry.getStatistics();

      expect(stats.mostRequestedLanguages).toEqual([
        { language: 'pt-PT', count: 2 },
        { language: 'en-GB', count: 1 },
      ]);

      expect(stats.mostAppliedLanguages).toEqual([
        { language: 'pt-BR', count: 2 },
        { language: 'en-US', count: 1 },
      ]);
    });
  });

  describe('clearMetrics', () => {
    it('should clear all recorded metrics', () => {
      const event: LanguageChangeEvent = {
        previousLanguage: 'en-US',
        newLanguage: 'pt-BR',
        fallbackUsed: false,
      };

      languageTelemetry.recordLanguageChange(event, 'preference');
      expect(languageTelemetry.getStatistics().total).toBe(1);

      languageTelemetry.clearMetrics();
      expect(languageTelemetry.getStatistics().total).toBe(0);
    });
  });
}); 