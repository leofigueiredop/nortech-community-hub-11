import { useTranslation } from 'react-i18next';
import { useLanguagePreference } from './useLanguagePreference';
import { useCallback } from 'react';
import i18next from 'i18next';

// Currency codes for supported languages
export const CURRENCY_BY_LANGUAGE = {
  'pt-BR': 'BRL',
  'en-US': 'USD',
} as const;

// Common date/time formats
export const DATE_FORMATS = {
  SHORT: { day: 'numeric', month: 'numeric', year: 'numeric' },
  MEDIUM: { day: 'numeric', month: 'short', year: 'numeric' },
  LONG: { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' },
  TIME: { hour: 'numeric', minute: 'numeric' },
  DATETIME: { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  },
} as const;

// Standalone formatting functions (for non-React contexts)
export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(
  value: number,
  locale: string,
  currency?: keyof typeof CURRENCY_BY_LANGUAGE,
  options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>
): string {
  const currencyCode = currency || CURRENCY_BY_LANGUAGE[locale as keyof typeof CURRENCY_BY_LANGUAGE];
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    ...options,
  }).format(value);
}

export function formatDate(
  date: Date | number,
  locale: string,
  format: keyof typeof DATE_FORMATS | Intl.DateTimeFormatOptions = DATE_FORMATS.MEDIUM
): string {
  const dateValue = date instanceof Date ? date : new Date(date);
  const options = typeof format === 'string' ? DATE_FORMATS[format] : format;
  return new Intl.DateTimeFormat(locale, options).format(dateValue);
}

export function formatRelativeTime(
  date: Date | number,
  locale: string,
  options?: Intl.RelativeTimeFormatOptions
): string {
  const dateValue = date instanceof Date ? date : new Date(date);
  const diffInMilliseconds = dateValue.getTime() - Date.now();
  const diffInSeconds = Math.round(diffInMilliseconds / 1000);
  const diffInMinutes = Math.round(diffInSeconds / 60);
  const diffInHours = Math.round(diffInMinutes / 60);
  const diffInDays = Math.round(diffInHours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', ...options });

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(diffInSeconds, 'second');
  } else if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute');
  } else if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  } else {
    return rtf.format(diffInDays, 'day');
  }
}

export function formatPercent(
  value: number,
  locale: string,
  options?: Omit<Intl.NumberFormatOptions, 'style'>
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }).format(value / 100);
}

export function formatDuration(
  minutes: number,
  locale: string,
): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  const parts = [];
  if (hours > 0) {
    parts.push(`${formatNumber(hours, locale)}h`);
  }
  if (remainingMinutes > 0 || parts.length === 0) {
    parts.push(`${formatNumber(remainingMinutes, locale)}m`);
  }
  
  return parts.join(' ');
}

// React hooks for automatic locale updates
export function useFormatNumber() {
  const { currentLanguage } = useLanguagePreference();
  
  return useCallback((
    value: number,
    options?: Intl.NumberFormatOptions
  ) => formatNumber(value, currentLanguage, options), [currentLanguage]);
}

export function useFormatCurrency() {
  const { currentLanguage } = useLanguagePreference();
  
  return useCallback((
    value: number,
    currency?: keyof typeof CURRENCY_BY_LANGUAGE,
    options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>
  ) => formatCurrency(value, currentLanguage, currency, options), [currentLanguage]);
}

export function useFormatDate() {
  const { currentLanguage } = useLanguagePreference();
  
  return useCallback((
    date: Date | number,
    format?: keyof typeof DATE_FORMATS | Intl.DateTimeFormatOptions
  ) => formatDate(date, currentLanguage, format), [currentLanguage]);
}

export function useFormatRelativeTime() {
  const { currentLanguage } = useLanguagePreference();
  
  return useCallback((
    date: Date | number,
    options?: Intl.RelativeTimeFormatOptions
  ) => formatRelativeTime(date, currentLanguage, options), [currentLanguage]);
}

export function useFormatPercent() {
  const { currentLanguage } = useLanguagePreference();
  
  return useCallback((
    value: number,
    options?: Omit<Intl.NumberFormatOptions, 'style'>
  ) => formatPercent(value, currentLanguage, options), [currentLanguage]);
}

export function useFormatDuration() {
  const { currentLanguage } = useLanguagePreference();
  
  return useCallback((
    minutes: number
  ) => formatDuration(minutes, currentLanguage), [currentLanguage]);
} 