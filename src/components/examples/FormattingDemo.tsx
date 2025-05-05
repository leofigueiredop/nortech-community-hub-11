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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function FormattingDemo() {
  const { currentLanguage, changeLanguage } = useLanguagePreference();
  
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

  // Edge cases
  const edgeCases = {
    numbers: [
      { value: 0.000000001, label: 'Very Small Number' },
      { value: 1000000000000, label: 'Very Large Number' },
      { value: -123456.789, label: 'Negative Number' },
      { value: Infinity, label: 'Infinity' },
      { value: NaN, label: 'Not a Number' }
    ],
    dates: [
      { value: new Date('2000-01-01'), label: 'Past Date (Y2K)' },
      { value: new Date('2050-12-31'), label: 'Future Date' },
      { value: new Date('1900-01-01'), label: 'Very Old Date' },
      { value: new Date('2100-01-01'), label: 'Very Future Date' }
    ],
    currencies: [
      { value: 0.01, label: 'Minimum Currency' },
      { value: 999999999.99, label: 'Large Currency' },
      { value: -50.25, label: 'Negative Currency' }
    ]
  };

  // Error handling example
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNumberChange = (value: string) => {
    try {
      const num = Number(value);
      if (isNaN(num)) throw new Error('Invalid number');
      setNumber(num);
      setHasError(false);
      setErrorMessage('');
    } catch (error) {
      setHasError(true);
      setErrorMessage('Please enter a valid number');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Formatting Examples</h1>
      
      {/* Language Switcher */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Language Selection</h2>
        <div className="flex gap-4">
          <Button 
            onClick={() => changeLanguage('en-US')}
            variant={currentLanguage === 'en-US' ? 'default' : 'outline'}
          >
            English (US)
          </Button>
          <Button 
            onClick={() => changeLanguage('pt-BR')}
            variant={currentLanguage === 'pt-BR' ? 'default' : 'outline'}
          >
            Português (BR)
          </Button>
        </div>
        <p className="mt-2 text-sm text-gray-600">Current Locale: {currentLanguage}</p>
      </div>

      {/* Number Formatting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Number Formatting</h2>
        <div className="flex items-center gap-4 mb-2">
          <Input
            type="text"
            value={number}
            onChange={(e) => handleNumberChange(e.target.value)}
            className="border p-2 rounded"
          />
          <span className="text-lg">{formatNumber(number)}</span>
        </div>
        {hasError && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Edge Cases</h3>
          <div className="grid gap-2">
            {edgeCases.numbers.map((edge, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{edge.label}:</span>
                <span>{formatNumber(edge.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Currency Formatting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Currency Formatting</h2>
        <div className="flex items-center gap-4 mb-2">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="border p-2 rounded"
          />
          <span className="text-lg">{formatCurrency(amount)}</span>
        </div>
        <div className="mt-2 space-y-2">
          <div>USD: {formatCurrency(amount, 'en-US')}</div>
          <div>BRL: {formatCurrency(amount, 'pt-BR')}</div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Edge Cases</h3>
          <div className="grid gap-2">
            {edgeCases.currencies.map((edge, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{edge.label}:</span>
                <div>
                  <div>USD: {formatCurrency(edge.value, 'en-US')}</div>
                  <div>BRL: {formatCurrency(edge.value, 'pt-BR')}</div>
                </div>
              </div>
            ))}
          </div>
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
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Edge Cases</h3>
          <div className="grid gap-2">
            {edgeCases.dates.map((edge, index) => (
              <div key={index}>
                <span className="text-sm text-gray-600">{edge.label}:</span>
                <div className="ml-4">
                  <div>Short: {formatDate(edge.value, 'SHORT')}</div>
                  <div>Long: {formatDate(edge.value, 'LONG')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Relative Time Formatting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Relative Time</h2>
        <div className="space-y-2">
          <p>Future: {formatRelativeTime(futureDate)}</p>
          <p>Past: {formatRelativeTime(pastDate)}</p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Edge Cases</h3>
            <div className="grid gap-2">
              {edgeCases.dates.map((edge, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{edge.label}:</span>
                  <span>{formatRelativeTime(edge.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Percentage Formatting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Percentage</h2>
        <div className="flex items-center gap-4 mb-2">
          <Input
            type="number"
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
            className="border p-2 rounded"
          />
          <span className="text-lg">{formatPercent(percent)}</span>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Edge Cases</h3>
          <div className="grid gap-2">
            <div>0%: {formatPercent(0)}</div>
            <div>100%: {formatPercent(100)}</div>
            <div>1000%: {formatPercent(1000)}</div>
            <div>-50%: {formatPercent(-50)}</div>
            <div>0.001%: {formatPercent(0.001)}</div>
          </div>
        </div>
      </section>

      {/* Duration Formatting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Duration</h2>
        <div className="flex items-center gap-4 mb-2">
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="border p-2 rounded"
          />
          <span className="text-lg">{formatDuration(duration)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Enter duration in minutes
        </p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Edge Cases</h3>
          <div className="grid gap-2">
            <div>0 minutes: {formatDuration(0)}</div>
            <div>1 minute: {formatDuration(1)}</div>
            <div>60 minutes: {formatDuration(60)}</div>
            <div>90 minutes: {formatDuration(90)}</div>
            <div>24 hours: {formatDuration(24 * 60)}</div>
            <div>7 days: {formatDuration(7 * 24 * 60)}</div>
          </div>
        </div>
      </section>
    </div>
  );
} 