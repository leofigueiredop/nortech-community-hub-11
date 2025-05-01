import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLanguagePreference } from '../useLanguagePreference';
import { languageService, LANGUAGE_EVENTS } from '../languageService';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';

// Mock the languageService
vi.mock('../languageService', () => ({
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
  },
  LANGUAGE_EVENTS: {
    LANGUAGE_CHANGED: 'languageChanged',
    FALLBACK_USED: 'fallbackUsed',
    PREFERENCE_SYNCED: 'preferenceSynced'
  }
}));

describe('useLanguagePreference', () => {
  // Wrap the hook in I18nextProvider for testing
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock return values
    vi.mocked(languageService.getCurrentLanguage).mockReturnValue('en-US');
  });

  it('should initialize with current language', () => {
    const { result } = renderHook(() => useLanguagePreference(), { wrapper });

    expect(result.current.currentLanguage).toBe('en-US');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle language change events', async () => {
    const { result } = renderHook(() => useLanguagePreference(), { wrapper });

    // Simulate language change event
    await act(async () => {
      const event = {
        previousLanguage: 'en-US',
        newLanguage: 'pt-BR',
        fallbackUsed: false
      };
      vi.mocked(languageService.getCurrentLanguage).mockReturnValue('pt-BR');
      languageService.emit(LANGUAGE_EVENTS.LANGUAGE_CHANGED, event);
    });

    expect(result.current.currentLanguage).toBe('pt-BR');
    expect(result.current.fallbackUsed).toBe(false);
  });

  it('should change language successfully', async () => {
    const { result } = renderHook(() => useLanguagePreference(), { wrapper });

    await act(async () => {
      await result.current.changeLanguage('pt-BR');
    });

    expect(languageService.changeLanguage).toHaveBeenCalledWith('pt-BR');
    expect(result.current.error).toBe(null);
  });

  it('should handle language change errors', async () => {
    const error = new Error('Language change failed');
    vi.mocked(languageService.changeLanguage).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useLanguagePreference(), { wrapper });

    await act(async () => {
      await expect(result.current.changeLanguage('invalid')).rejects.toThrow('Language change failed');
    });

    expect(result.current.error).toEqual(error);
  });

  it('should reset to default language', async () => {
    const { result } = renderHook(() => useLanguagePreference(), { wrapper });

    await act(async () => {
      await result.current.resetToDefault();
    });

    expect(languageService.resetToDefault).toHaveBeenCalled();
    expect(result.current.error).toBe(null);
  });

  it('should handle reset errors', async () => {
    const error = new Error('Reset failed');
    vi.mocked(languageService.resetToDefault).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useLanguagePreference(), { wrapper });

    await act(async () => {
      await expect(result.current.resetToDefault()).rejects.toThrow('Reset failed');
    });

    expect(result.current.error).toEqual(error);
  });
}); 