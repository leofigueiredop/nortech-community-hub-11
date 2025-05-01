import { useState } from 'react';
import {
  useFormatNumber,
  useFormatCurrency,
  useFormatDate,
  useFormatRelativeTime,
  useFormatPercent,
  useFormatDuration,
  CURRENCY_BY_LANGUAGE
} from '@/utils/i18n/formatters';
import { useLanguagePreference } from '@/utils/i18n/useLanguagePreference';

export function FormattingDemo() {
  const { currentLanguage } = useLanguagePreference();
  
  // Get formatting functions
  const formatNumber = useFormatNumber();
  const formatCurrency = useFormatCurrency();
  const formatDate = useFormatDate();
  const formatRelativeTime = useFormatRelativeTime();
  const formatPercent = useFormatPercent();
  const formatDuration = useFormatDuration();
  
  // Example values
  const [number, setNumber] = useState(1234567.89);
  const [amount, setAmount] = useState(99.99);
  const [date] = useState(new Date());
  const [futureDate] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)); // 2 days from now
  const [pastDate] = useState(new Date(Date.now() - 3 * 60 * 60 * 1000)); // 3 hours ago
  const [percent, setPercent] = useState(75.5);
  const [duration, setDuration] = useState(90);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Formatting Examples</h1>
      <p className="mb-4 text-gray-600">Current Locale: {currentLanguage}</p>

      {/* Number Formatting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Number Formatting</h2>
        <div className="flex items-center gap-4 mb-2">
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
            className="border p-2 rounded"
          />
          <span className="text-lg">{formatNumber(number)}</span>
        </div>
        <p className="text-sm text-gray-600">
          Try changing the number to see different formatting
        </p>
      </section>

      {/* Currency Formatting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Currency Formatting</h2>
        <div className="flex items-center gap-4 mb-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="border p-2 rounded"
          />
          <span className="text-lg">{formatCurrency(amount)}</span>
        </div>
        <div className="mt-2">
          <span className="mr-4">USD: {formatCurrency(amount, 'en-US')}</span>
          <span>BRL: {formatCurrency(amount, 'pt-BR')}</span>
        </div>
      </section>

      {/* Date Formatting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Date Formatting</h2>
        <div className="space-y-2">
          <p>Short: {formatDate(date, 'SHORT')}</p>
          <p>Medium: {formatDate(date, 'MEDIUM')}</p>
          <p>Long: {formatDate(date, 'LONG')}</p>
          <p>Time: {formatDate(date, 'TIME')}</p>
          <p>DateTime: {formatDate(date, 'DATETIME')}</p>
        </div>
      </section>

      {/* Relative Time Formatting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Relative Time</h2>
        <div className="space-y-2">
          <p>Future: {formatRelativeTime(futureDate)}</p>
          <p>Past: {formatRelativeTime(pastDate)}</p>
        </div>
      </section>

      {/* Percentage Formatting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Percentage</h2>
        <div className="flex items-center gap-4 mb-2">
          <input
            type="number"
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
            className="border p-2 rounded"
          />
          <span className="text-lg">{formatPercent(percent)}</span>
        </div>
      </section>

      {/* Duration Formatting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Duration</h2>
        <div className="flex items-center gap-4 mb-2">
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="border p-2 rounded"
          />
          <span className="text-lg">{formatDuration(duration)}</span>
        </div>
        <p className="text-sm text-gray-600">
          Enter duration in minutes
        </p>
      </section>
    </div>
  );
} 