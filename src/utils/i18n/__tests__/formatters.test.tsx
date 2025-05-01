import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { LanguageProvider } from '../LanguageContext';
import i18next from 'i18next';
import {
  useFormatNumber,
  useFormatCurrency,
  useFormatDate,
  useFormatRelativeTime,
  useFormatPercent,
  useFormatDuration,
  CURRENCY_BY_LANGUAGE,
  DATE_FORMATS
} from '../formatters';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
};

describe('Formatting utilities', () => {
  describe('useFormatNumber', () => {
    it('formats numbers according to locale', () => {
      const { result } = renderHook(() => useFormatNumber(), { wrapper: Wrapper });
      
      // Test en-US formatting
      expect(result.current(1234.56)).toBe('1,234.56');
      
      // Change language to pt-BR and test
      i18next.changeLanguage('pt-BR');
      expect(result.current(1234.56)).toBe('1.234,56');
    });
  });

  describe('useFormatCurrency', () => {
    it('formats currency according to locale', () => {
      const { result } = renderHook(() => useFormatCurrency(), { wrapper: Wrapper });
      
      // Test USD formatting
      expect(result.current(1234.56)).toBe('$1,234.56');
      
      // Change language to pt-BR and test BRL
      i18next.changeLanguage('pt-BR');
      expect(result.current(1234.56)).toBe('R$ 1.234,56');
    });
  });

  describe('useFormatDate', () => {
    it('formats dates according to locale', () => {
      const { result } = renderHook(() => useFormatDate(), { wrapper: Wrapper });
      const testDate = new Date('2024-03-15T12:00:00Z');
      
      // Test en-US formatting
      expect(result.current(testDate, 'SHORT')).toMatch(/3\/15\/2024/);
      
      // Change language to pt-BR and test
      i18next.changeLanguage('pt-BR');
      expect(result.current(testDate, 'SHORT')).toMatch(/15\/03\/2024/);
    });
  });

  describe('useFormatRelativeTime', () => {
    it('formats relative time according to locale', () => {
      const { result } = renderHook(() => useFormatRelativeTime(), { wrapper: Wrapper });
      const now = Date.now();
      const futureDate = new Date(now + 24 * 60 * 60 * 1000); // 1 day in future
      const pastDate = new Date(now - 24 * 60 * 60 * 1000); // 1 day in past
      
      // Test en-US formatting
      expect(result.current(futureDate)).toContain('in 1 day');
      expect(result.current(pastDate)).toContain('1 day ago');
      
      // Change language to pt-BR and test
      i18next.changeLanguage('pt-BR');
      expect(result.current(futureDate)).toContain('em 1 dia');
      expect(result.current(pastDate)).toContain('há 1 dia');
    });
  });

  describe('useFormatPercent', () => {
    it('formats percentages according to locale', () => {
      const { result } = renderHook(() => useFormatPercent(), { wrapper: Wrapper });
      
      // Test en-US formatting
      expect(result.current(0.1234)).toBe('12.34%');
      
      // Change language to pt-BR and test
      i18next.changeLanguage('pt-BR');
      expect(result.current(0.1234)).toBe('12,34%');
    });
  });

  describe('useFormatDuration', () => {
    it('formats durations according to locale', () => {
      const { result } = renderHook(() => useFormatDuration(), { wrapper: Wrapper });
      const duration = 90; // 1 hour, 30 minutes
      
      // Test en-US formatting
      expect(result.current(duration)).toBe('1h 30m');
      
      // Change language to pt-BR and test
      i18next.changeLanguage('pt-BR');
      expect(result.current(duration)).toBe('1h 30m');
    });
  });
}); 