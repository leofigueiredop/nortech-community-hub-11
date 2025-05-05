import {
  formatNumber,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatPercent,
  formatDuration,
  DATE_FORMATS,
  CURRENCY_BY_LANGUAGE
} from '../formatters';

describe('Formatting Utilities', () => {
  describe('Number Formatting', () => {
    const testCases = [
      { locale: 'en-US', input: 1234567.89, expected: '1,234,567.89' },
      { locale: 'pt-BR', input: 1234567.89, expected: '1.234.567,89' },
      { locale: 'en-US', input: 0.000000001, expected: '0' },
      { locale: 'en-US', input: 1000000000000, expected: '1,000,000,000,000' },
      { locale: 'en-US', input: -123456.789, expected: '-123,456.789' },
      { locale: 'en-US', input: Infinity, expected: '∞' },
      { locale: 'en-US', input: NaN, expected: 'NaN' },
    ];

    test.each(testCases)('formats $input in $locale', ({ locale, input, expected }) => {
      expect(formatNumber(input, locale)).toBe(expected);
    });

    test('handles custom format options', () => {
      expect(formatNumber(123.456, 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
        .toBe('123.46');
    });
  });

  describe('Currency Formatting', () => {
    const testCases = [
      { locale: 'en-US', input: 99.99, expected: '$99.99' },
      { locale: 'pt-BR', input: 99.99, expected: 'R$ 99,99' },
      { locale: 'en-US', input: 0.01, expected: '$0.01' },
      { locale: 'en-US', input: 999999999.99, expected: '$999,999,999.99' },
      { locale: 'en-US', input: -50.25, expected: '-$50.25' },
      { locale: 'pt-BR', input: -50.25, expected: '-R$ 50,25' },
    ];

    test.each(testCases)('formats $input in $locale', ({ locale, input, expected }) => {
      expect(formatCurrency(input, locale)).toBe(expected);
    });

    test('handles different currencies', () => {
      expect(formatCurrency(99.99, 'en-US', 'en-US')).toBe('$99.99');
      expect(formatCurrency(99.99, 'pt-BR', 'pt-BR')).toBe('R$ 99,99');
    });

    test('handles custom format options', () => {
      expect(formatCurrency(99.99, 'en-US', 'en-US', { minimumFractionDigits: 0 }))
        .toBe('$100');
    });
  });

  describe('Date Formatting', () => {
    const testDate = new Date('2024-01-31T13:45:00Z');
    const testCases = [
      { 
        locale: 'en-US',
        format: 'SHORT',
        expected: '1/31/2024'
      },
      { 
        locale: 'pt-BR',
        format: 'SHORT',
        expected: '31/01/2024'
      },
      { 
        locale: 'en-US',
        format: 'LONG',
        expected: 'Wednesday, January 31, 2024'
      },
    ];

    test.each(testCases)('formats date in $locale using $format format', ({ locale, format, expected }) => {
      expect(formatDate(testDate, locale, format as keyof typeof DATE_FORMATS))
        .toBe(expected);
    });

    test('handles edge case dates', () => {
      const edgeCases = [
        new Date('2000-01-01'),
        new Date('2050-12-31'),
        new Date('1900-01-01'),
        new Date('2100-01-01'),
      ];

      edgeCases.forEach(date => {
        expect(() => formatDate(date, 'en-US', 'LONG')).not.toThrow();
      });
    });

    test('handles custom format options', () => {
      expect(formatDate(testDate, 'en-US', { 
        weekday: 'short',
        month: 'numeric',
        day: 'numeric'
      })).toBe('Wed, 1/31');
    });
  });

  describe('Relative Time Formatting', () => {
    const now = new Date('2024-01-31T12:00:00Z').getTime();
    jest.spyOn(Date, 'now').mockImplementation(() => now);

    const testCases = [
      { 
        locale: 'en-US',
        input: new Date(now - 3600 * 1000),
        expected: '1 hour ago'
      },
      { 
        locale: 'pt-BR',
        input: new Date(now - 3600 * 1000),
        expected: 'há 1 hora'
      },
      { 
        locale: 'en-US',
        input: new Date(now + 2 * 24 * 3600 * 1000),
        expected: 'in 2 days'
      },
    ];

    test.each(testCases)('formats relative time in $locale', ({ locale, input, expected }) => {
      expect(formatRelativeTime(input, locale)).toBe(expected);
    });

    test('handles edge case dates', () => {
      const edgeCases = [
        new Date('2000-01-01'),
        new Date('2050-12-31'),
        new Date('1900-01-01'),
        new Date('2100-01-01'),
      ];

      edgeCases.forEach(date => {
        expect(() => formatRelativeTime(date, 'en-US')).not.toThrow();
      });
    });

    test('handles custom format options', () => {
      expect(formatRelativeTime(
        new Date(now - 3600 * 1000),
        'en-US',
        { numeric: 'always' }
      )).toBe('1 hour ago');
    });
  });

  describe('Percent Formatting', () => {
    const testCases = [
      { locale: 'en-US', input: 75.5, expected: '75.5%' },
      { locale: 'pt-BR', input: 75.5, expected: '75,5%' },
      { locale: 'en-US', input: 0, expected: '0%' },
      { locale: 'en-US', input: 100, expected: '100%' },
      { locale: 'en-US', input: 1000, expected: '1,000%' },
      { locale: 'en-US', input: -50, expected: '-50%' },
      { locale: 'en-US', input: 0.001, expected: '0%' },
    ];

    test.each(testCases)('formats $input% in $locale', ({ locale, input, expected }) => {
      expect(formatPercent(input, locale)).toBe(expected);
    });

    test('handles custom format options', () => {
      expect(formatPercent(75.5, 'en-US', { minimumFractionDigits: 1 }))
        .toBe('75.5%');
    });
  });

  describe('Duration Formatting', () => {
    const testCases = [
      { locale: 'en-US', input: 0, expected: '0m' },
      { locale: 'en-US', input: 1, expected: '1m' },
      { locale: 'en-US', input: 60, expected: '1h' },
      { locale: 'en-US', input: 90, expected: '1h 30m' },
      { locale: 'en-US', input: 24 * 60, expected: '24h' },
      { locale: 'en-US', input: 7 * 24 * 60, expected: '168h' },
      { locale: 'pt-BR', input: 90, expected: '1h 30m' },
    ];

    test.each(testCases)('formats $input minutes in $locale', ({ locale, input, expected }) => {
      expect(formatDuration(input, locale)).toBe(expected);
    });
  });
}); 