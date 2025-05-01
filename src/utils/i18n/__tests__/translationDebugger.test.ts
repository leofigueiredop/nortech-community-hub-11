import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { translationDebugger } from '../translationDebugger';
import type { DebugModeConfig } from '../translationDebugger';

describe('TranslationDebugger', () => {
  beforeEach(() => {
    // Reset the debugger state before each test
    translationDebugger.setConfig({
      highlightMissing: false,
      showKeys: false,
      logMissing: false,
      trackUsage: false
    });
    translationDebugger.clearTranslationInfo();
  });

  afterEach(() => {
    // Clean up any event listeners
    window.dispatchEvent(new Event('beforeunload'));
  });

  describe('Configuration', () => {
    it('should initialize with default config', () => {
      const config = translationDebugger.getConfig();
      expect(config).toEqual({
        highlightMissing: false,
        showKeys: false,
        logMissing: false,
        trackUsage: false
      });
    });

    it('should update config and emit event', () => {
      const listener = vi.fn();
      window.addEventListener('translationDebugConfigChanged', listener);

      translationDebugger.setConfig({ highlightMissing: true });

      expect(translationDebugger.getConfig().highlightMissing).toBe(true);
      expect(listener).toHaveBeenCalled();

      window.removeEventListener('translationDebugConfigChanged', listener);
    });
  });

  describe('Translation Tracking', () => {
    it('should track translation usage', () => {
      translationDebugger.setConfig({ trackUsage: true });

      const content = translationDebugger.wrapContent(
        'Hello',
        'test.key',
        'common',
        'translation'
      );

      const info = translationDebugger.getAllTranslationInfo();
      expect(info).toHaveLength(1);
      expect(info[0]).toMatchObject({
        key: 'test.key',
        namespace: 'common',
        source: 'translation'
      });
    });

    it('should not track when tracking is disabled', () => {
      translationDebugger.setConfig({ trackUsage: false });

      translationDebugger.wrapContent(
        'Hello',
        'test.key',
        'common',
        'translation'
      );

      expect(translationDebugger.getAllTranslationInfo()).toHaveLength(0);
    });

    it('should clear translation info', () => {
      translationDebugger.setConfig({ trackUsage: true });

      translationDebugger.wrapContent(
        'Hello',
        'test.key',
        'common',
        'translation'
      );

      translationDebugger.clearTranslationInfo();
      expect(translationDebugger.getAllTranslationInfo()).toHaveLength(0);
    });
  });

  describe('Content Wrapping', () => {
    it('should wrap content with debug info when enabled', () => {
      translationDebugger.setConfig({
        highlightMissing: true,
        showKeys: true
      });

      const wrapped = translationDebugger.wrapContent(
        'Hello',
        'greeting',
        'common',
        'translation'
      );

      expect(wrapped).toContain('Hello');
      expect(wrapped).toContain('[greeting]');
    });

    it('should highlight missing translations', () => {
      translationDebugger.setConfig({
        highlightMissing: true,
        showKeys: true
      });

      const wrapped = translationDebugger.wrapContent(
        'greeting',
        'greeting',
        'common',
        'key'
      );

      expect(wrapped).toContain('⚠️');
      expect(wrapped).toContain('[greeting]');
    });

    it('should not wrap content when disabled', () => {
      translationDebugger.setIsEnabled(false);

      const wrapped = translationDebugger.wrapContent(
        'Hello',
        'greeting',
        'common',
        'translation'
      );

      expect(wrapped).toBe('Hello');
      
      // Reset enabled state for other tests
      translationDebugger.setIsEnabled(true);
    });
  });

  describe('Console Logging', () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should log missing translations when enabled', () => {
      translationDebugger.setConfig({ logMissing: true });

      translationDebugger.wrapContent(
        'test.key',
        'test.key',
        'common',
        'key'
      );

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Missing translation'),
        expect.stringContaining('test.key'),
        expect.stringContaining('common')
      );
    });

    it('should not log when logging is disabled', () => {
      translationDebugger.setConfig({ logMissing: false });

      translationDebugger.wrapContent(
        'test.key',
        'test.key',
        'common',
        'key'
      );

      expect(console.warn).not.toHaveBeenCalled();
    });
  });
}); 