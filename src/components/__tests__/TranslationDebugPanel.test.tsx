import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TranslationDebugPanel } from '../TranslationDebugPanel';
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

describe('TranslationDebugPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    translationDebugger.setConfig({
      highlightMissing: true,
      showKeys: true,
      logMissing: true,
      trackUsage: true
    });
    translationDebugger.setIsEnabled(true);
  });

  it('should render debug panel when enabled', () => {
    render(<TranslationDebugPanel />);
    expect(screen.getByText(/translation debug/i)).toBeInTheDocument();
  });

  it('should not render when disabled', () => {
    translationDebugger.setIsEnabled(false);
    render(<TranslationDebugPanel />);
    expect(screen.queryByText(/translation debug/i)).not.toBeInTheDocument();
  });

  it('should toggle panel visibility', () => {
    render(<TranslationDebugPanel />);
    const toggleButton = screen.getByText(/translation debug/i);

    fireEvent.click(toggleButton);
    expect(screen.getByText(/debug settings/i)).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.queryByText(/debug settings/i)).not.toBeInTheDocument();
  });

  it('should update debug settings', () => {
    render(<TranslationDebugPanel />);
    fireEvent.click(screen.getByText(/translation debug/i));

    const highlightCheckbox = screen.getByLabelText(/highlight missing/i);
    fireEvent.click(highlightCheckbox);

    expect(translationDebugger.getConfig().highlightMissing).toBe(false);
  });

  it('should display translation info', async () => {
    translationDebugger.wrapContent('Hello', 'greeting', 'common');

    render(<TranslationDebugPanel />);
    fireEvent.click(screen.getByText(/translation debug/i));

    await waitFor(() => {
      expect(screen.getByText('greeting')).toBeInTheDocument();
      expect(screen.getByText('common')).toBeInTheDocument();
    });
  });

  it('should filter translation info', async () => {
    translationDebugger.wrapContent('Hello', 'greeting.hello', 'common');
    translationDebugger.wrapContent('Goodbye', 'greeting.bye', 'common');

    render(<TranslationDebugPanel />);
    fireEvent.click(screen.getByText(/translation debug/i));

    const filterInput = screen.getByPlaceholderText(/filter/i);
    fireEvent.change(filterInput, { target: { value: 'hello' } });

    await waitFor(() => {
      expect(screen.getByText('greeting.hello')).toBeInTheDocument();
      expect(screen.queryByText('greeting.bye')).not.toBeInTheDocument();
    });
  });

  it('should clear translation info', async () => {
    translationDebugger.wrapContent('Hello', 'greeting', 'common');

    render(<TranslationDebugPanel />);
    fireEvent.click(screen.getByText(/translation debug/i));

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.queryByText('greeting')).not.toBeInTheDocument();
    });
  });
}); 