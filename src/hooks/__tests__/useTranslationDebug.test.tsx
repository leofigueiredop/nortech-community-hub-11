import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTranslationDebug } from '../useTranslationDebug';
import { translationDebugger } from '../../utils/i18n/translationDebugger';
import { languageService } from '../../utils/i18n/languageService';

// Mock languageService
vi.mock('../../utils/i18n/languageService', () => ({
  languageService: {
    getCurrentLanguage: vi.fn().mockReturnValue('en-US'),
    getCurrentDirection: vi.fn().mockReturnValue('ltr'),
    changeLanguage: vi.fn(),
    resetToDefault: vi.fn(),
    wouldUseFallback: vi.fn(),
    getFallbackChain: vi.fn(),
    getTelemetryStats: vi.fn(),
    setServerStorageProvider: vi.fn(),
    syncWithServer: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
  }
}));

describe('useTranslationDebug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    translationDebugger.setConfig({
      highlightMissing: true,
      showKeys: true,
      logMissing: true,
      trackUsage: true
    });
  });

  it('should return current debug configuration', () => {
    const { result } = renderHook(() => useTranslationDebug());

    expect(result.current.config).toEqual({
      highlightMissing: true,
      showKeys: true,
      logMissing: true,
      trackUsage: true
    });
  });

  it('should update configuration', () => {
    const { result } = renderHook(() => useTranslationDebug());

    act(() => {
      result.current.setConfig({ highlightMissing: false });
    });

    expect(result.current.config.highlightMissing).toBe(false);
  });

  it('should wrap content with debug info', () => {
    const { result } = renderHook(() => useTranslationDebug());

    const wrapped = result.current.wrapContent('Hello', 'greeting', 'common');

    expect(wrapped).toBe('Hello [greeting]');
  });

  it('should wrap missing translations with warning', () => {
    const { result } = renderHook(() => useTranslationDebug());

    const wrapped = result.current.wrapContent('greeting', 'greeting', 'common');

    expect(wrapped).toBe('⚠️ greeting [greeting]');
  });

  it('should track translation usage', () => {
    const { result } = renderHook(() => useTranslationDebug());

    result.current.wrapContent('Hello', 'greeting', 'common');

    const info = result.current.getAllTranslationInfo();
    expect(info).toHaveLength(1);
    expect(info[0]).toMatchObject({
      key: 'greeting',
      namespace: 'common',
      language: 'en-US',
      source: 'translation'
    });
  });

  it('should clear translation info', () => {
    const { result } = renderHook(() => useTranslationDebug());

    result.current.wrapContent('Hello', 'greeting', 'common');
    result.current.clearTranslationInfo();

    expect(result.current.getAllTranslationInfo()).toHaveLength(0);
  });

  it('should update config when debug settings change', () => {
    const { result } = renderHook(() => useTranslationDebug());

    act(() => {
      window.dispatchEvent(
        new CustomEvent('translationDebugConfigChanged', {
          detail: {
            highlightMissing: false,
            showKeys: false,
            logMissing: false,
            trackUsage: false
          }
        })
      );
    });

    expect(result.current.config).toEqual({
      highlightMissing: false,
      showKeys: false,
      logMissing: false,
      trackUsage: false
    });
  });
}); 