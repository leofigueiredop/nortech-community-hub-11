# Internationalization (i18n) Formatting Utilities

This module provides a comprehensive set of utilities for handling locale-specific formatting in the application. It supports both standalone functions and React hooks for formatting numbers, currencies, dates, and durations.

## Supported Locales

- 🇺🇸 English (en-US)
- 🇧🇷 Portuguese (pt-BR)

## Installation

The formatting utilities are available through the `src/utils/i18n/formatters.ts` module:

```typescript
import { 
  formatNumber,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatPercent,
  formatDuration,
  // React hooks
  useFormatNumber,
  useFormatCurrency,
  useFormatDate,
  useFormatRelativeTime,
  useFormatPercent,
  useFormatDuration
} from '@/utils/i18n/formatters';
```

## Number Formatting

### Standalone Function

```typescript
formatNumber(value: number, locale: string, options?: Intl.NumberFormatOptions): string

// Examples
formatNumber(1234.56, 'en-US') // "1,234.56"
formatNumber(1234.56, 'pt-BR') // "1.234,56"

// With options
formatNumber(1234.56, 'en-US', { 
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}) // "1,234.56"
```

### React Hook

```typescript
const formatNumber = useFormatNumber();

// Usage in component
formatNumber(1234.56) // Automatically uses current locale
```

## Currency Formatting

### Supported Currencies by Locale

- 🇺🇸 en-US: USD ($)
- 🇧🇷 pt-BR: BRL (R$)

### Standalone Function

```typescript
formatCurrency(
  value: number,
  locale: string,
  currency?: 'USD' | 'BRL',
  options?: Intl.NumberFormatOptions
): string

// Examples
formatCurrency(29.99, 'en-US') // "$29.99"
formatCurrency(29.99, 'pt-BR') // "R$ 29,99"

// Specify currency
formatCurrency(29.99, 'en-US', 'BRL') // "R$29.99"
```

### React Hook

```typescript
const formatCurrency = useFormatCurrency();

// Usage in component
formatCurrency(29.99) // Uses current locale's currency
formatCurrency(29.99, 'BRL') // Forces BRL currency
```

## Date Formatting

### Available Date Formats

- `SHORT`: Numeric date (e.g., "12/31/2023")
- `MEDIUM`: Abbreviated month (e.g., "Dec 31, 2023")
- `LONG`: Full date with weekday (e.g., "Sunday, December 31, 2023")
- `TIME`: Time only (e.g., "13:45")
- `DATETIME`: Date and time (e.g., "Dec 31, 2023, 13:45")

### Standalone Function

```typescript
formatDate(
  date: Date | number,
  locale: string,
  format?: keyof typeof DATE_FORMATS | Intl.DateTimeFormatOptions
): string

// Examples
formatDate(new Date(), 'en-US', 'SHORT') // "12/31/2023"
formatDate(new Date(), 'pt-BR', 'LONG') // "domingo, 31 de dezembro de 2023"

// Custom format
formatDate(new Date(), 'en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
}) // "Sunday, December 31"
```

### React Hook

```typescript
const formatDate = useFormatDate();

// Usage in component
formatDate(new Date(), 'SHORT')
```

## Relative Time Formatting

### Standalone Function

```typescript
formatRelativeTime(
  date: Date | number,
  locale: string,
  options?: Intl.RelativeTimeFormatOptions
): string

// Examples
formatRelativeTime(futureDate, 'en-US') // "in 2 days"
formatRelativeTime(pastDate, 'pt-BR') // "há 3 horas"
```

### React Hook

```typescript
const formatRelativeTime = useFormatRelativeTime();

// Usage in component
formatRelativeTime(someDate)
```

## Percentage Formatting

### Standalone Function

```typescript
formatPercent(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string

// Examples
formatPercent(25.5, 'en-US') // "25.5%"
formatPercent(25.5, 'pt-BR') // "25,5%"
```

### React Hook

```typescript
const formatPercent = useFormatPercent();

// Usage in component
formatPercent(25.5)
```

## Duration Formatting

### Standalone Function

```typescript
formatDuration(minutes: number, locale: string): string

// Examples
formatDuration(90, 'en-US') // "1h 30m"
formatDuration(45, 'pt-BR') // "45m"
```

### React Hook

```typescript
const formatDuration = useFormatDuration();

// Usage in component
formatDuration(90)
```

## Locale-Specific Differences

### Number Formatting
- 🇺🇸 en-US: Uses period (.) for decimal and comma (,) for thousands
- 🇧🇷 pt-BR: Uses comma (,) for decimal and period (.) for thousands

### Currency Formatting
- 🇺🇸 en-US: Symbol before number, no space ($123.45)
- 🇧🇷 pt-BR: Symbol before number with space (R$ 123,45)

### Date Formatting
- 🇺🇸 en-US: MM/DD/YYYY format, AM/PM time
- 🇧🇷 pt-BR: DD/MM/YYYY format, 24-hour time

## Best Practices

1. **Use React Hooks in Components**
   - Prefer the React hooks (`useFormat*`) in components as they automatically handle locale changes
   - Hooks ensure the formatted values update when the language changes

2. **Standalone Functions for Services**
   - Use the standalone functions in services or non-React code
   - Always pass the current locale explicitly

3. **Type Safety**
   - TypeScript types are provided for all functions and options
   - Use the provided types to ensure correct usage

4. **Performance**
   - Formatters are memoized in hooks to prevent unnecessary re-renders
   - Avoid creating new formatter instances outside of hooks/components

5. **Testing**
   - Test with different locales to ensure correct formatting
   - Include edge cases (negative numbers, zero, large numbers)
   - Test locale switching behavior in components 

# Internationalization (i18n) Utilities

This directory contains utilities for handling internationalization in the application.

## Features

- Language detection and switching
- Number formatting
- Currency formatting
- Date formatting
- Relative time formatting
- Percentage formatting
- Duration formatting
- Pluralization and complex translation rules

## Setup

The i18n system is configured in `src/i18n.ts` and uses the following packages:

- `i18next`: Core internationalization framework
- `react-i18next`: React bindings for i18next
- `i18next-browser-languagedetector`: Automatic language detection
- `i18next-http-backend`: Dynamic loading of translations
- `i18next-icu`: ICU message format support for complex pluralization

## Translation Files

Translation files are organized by language and namespace in the `public/locales` directory:

```
public/locales/
├── en-US/
│   ├── common.json    # Common translations
│   ├── forms.json     # Form-related translations
│   ├── features.json  # Feature-specific translations
│   ├── auth.json      # Authentication-related translations
│   ├── navigation.json # Navigation-related translations
│   └── plurals.json   # Pluralization examples and complex patterns
└── pt-BR/
    ├── common.json
    ├── forms.json
    ├── features.json
    ├── auth.json
    ├── navigation.json
    └── plurals.json
```

## Pluralization

The application supports complex pluralization rules using the ICU message format. This allows for handling various plural forms and context-based translations.

### Simple Pluralization

Use the `usePlural` hook for basic pluralization:

```tsx
const plural = usePlural();

// Examples:
plural('items', { count: 0 }); // "No items"
plural('items', { count: 1 }); // "One item"
plural('items', { count: 5 }); // "5 items"

plural('messages', { count: 0 }); // "No messages"
plural('messages', { count: 1 }); // "You have one message"
plural('messages', { count: 3 }); // "You have 3 messages"
```

### Context-Based Translations

Use the `useComplexPlural` hook for translations that depend on context:

```tsx
const { t } = useComplexPlural();

// User roles
t('context.user.role', { context: 'admin' }); // "Administrator"
t('context.user.role', { context: 'moderator' }); // "Moderator"
t('context.user.role', { context: 'member' }); // "Member"

// Post visibility
t('context.post.visibility', { context: 'public' }); // "Public"
t('context.post.visibility', { context: 'private' }); // "Private"
t('context.post.visibility', { context: 'members' }); // "Members Only"
```

### Complex Pluralization

Use the `useContextPlural` hook for complex pluralization that may include both count and context:

```tsx
const { t } = useContextPlural();

// Event attendance
t('complex.eventAttendance', { count: 0 }); // "No one is attending this event"
t('complex.eventAttendance', { count: 1 }); // "One person is attending this event"
t('complex.eventAttendance', { count: 3 }); // "3 people are attending this event"

// Task completion with period
t('complex.taskCompletion', { count: 2, period: 'today' }); // "Completed 2 tasks today"
t('complex.taskCompletion', { count: 1, period: 'week' }); // "Completed one task this week"
t('complex.taskCompletion', { count: 0, period: 'month' }); // "No tasks completed this month"
```

### Translation File Structure

The pluralization rules are defined in the `plurals.json` files. Here's an example structure:

```json
{
  "items": {
    "zero": "No items",
    "one": "One item",
    "other": "{{count}} items"
  },
  "complex": {
    "eventAttendance": "{{count, plural, =0 {No one is attending} =1 {One person is attending} other {# people are attending}}} this event",
    "taskCompletion": "{{count, plural, =0 {No tasks completed} =1 {Completed one task} other {Completed # tasks}}} {{period, select, today {today} week {this week} month {this month} other {in total}}}"
  },
  "context": {
    "user": {
      "role": {
        "admin": "Administrator",
        "moderator": "Moderator",
        "member": "Member"
      }
    }
  }
}
```

## Demo Components

Check out these components for examples of using the i18n utilities:

- `FormattingDemo.tsx`: Demonstrates basic formatting utilities
- `PluralizationDemo.tsx`: Shows various pluralization and context-based translation features

## Testing

The i18n utilities come with comprehensive tests:

- `formatters.test.tsx`: Tests for formatting functions
- `usePlural.test.tsx`: Tests for pluralization hooks

Run tests with:

```bash
npm test
```

## Language Context

The application uses a `LanguageContext` to manage the current language:

```tsx
const { language, setLanguage } = useLanguage();

// Switch language
setLanguage('pt-BR');
```

The context automatically updates i18next when the language changes, ensuring all translations are updated throughout the application.

## Best Practices

1. **Use Namespaces**: Organize translations into logical namespaces to keep files manageable.
2. **Provide Context**: Use context-based translations when the same term might be translated differently in different situations.
3. **Handle Zero Cases**: Always provide translations for zero cases to improve user experience.
4. **Use ICU Format**: For complex pluralization rules, use the ICU message format instead of simple key-value pairs.
5. **Test Translations**: Write tests to ensure pluralization rules work correctly across languages.
6. **Document Examples**: Include examples in comments when adding new translation patterns.
7. **Keep Files Small**: Split large translation files into smaller, focused namespaces.
8. **Use Type Safety**: Leverage TypeScript to catch missing translations and invalid keys.

## Contributing

When adding new translations:

1. Add keys to both language files (en-US and pt-BR)
2. Update type declarations if adding new namespaces
3. Add tests for new pluralization rules
4. Document complex patterns
5. Update the demo components if adding significant new features 

# Formatting Utilities for i18n

This document describes the utilities and hooks for locale-aware formatting of dates, numbers, and currency in the NortechCommunity project.

## Overview

The formatting utilities in `formatters.ts` provide a consistent, locale-aware way to display dates, numbers, percentages, durations, and currency values throughout the application. They automatically use the current language/locale selected by the user and update when the language changes.

## Standalone Formatting Functions

These functions can be used outside React components:

```typescript
import { formatNumber, formatCurrency, formatDate, formatRelativeTime, formatPercent, formatDuration } from './formatters';

formatNumber(1234567.89, 'en-US'); // "1,234,567.89"
formatCurrency(99.99, 'pt-BR'); // "R$ 99,99"
formatDate(new Date(), 'en-US', 'LONG'); // "Monday, January 1, 2024"
formatRelativeTime(new Date(Date.now() - 3600 * 1000), 'en-US'); // "1 hour ago"
formatPercent(75, 'en-US'); // "75%"
formatDuration(135, 'en-US'); // "2h 15m"
```

## React Hooks

Hooks automatically use the current language and update on language change:

```typescript
import { useFormatNumber, useFormatCurrency, useFormatDate, useFormatRelativeTime, useFormatPercent, useFormatDuration } from './formatters';

const formatNumber = useFormatNumber();
const formatCurrency = useFormatCurrency();
const formatDate = useFormatDate();
const formatRelativeTime = useFormatRelativeTime();
const formatPercent = useFormatPercent();
const formatDuration = useFormatDuration();

// Usage in a component
<span>{formatCurrency(49.99)}</span>
<span>{formatDate(new Date(), 'MEDIUM')}</span>
```

## Supported Locales and Currencies
- `en-US`: USD ($)
- `pt-BR`: BRL (R$)

## Date Formats
- `SHORT`: 1/31/2024
- `MEDIUM`: Jan 31, 2024
- `LONG`: Wednesday, January 31, 2024
- `TIME`: 13:45
- `DATETIME`: Jan 31, 2024, 13:45

## Best Practices
- Always use these utilities/hooks for displaying user-facing dates, numbers, and currency.
- For dynamic content, use the hooks to ensure updates on language change.
- For accessibility, ensure formatted values have appropriate labels/aria attributes.

## Troubleshooting
- If formatting does not update on language change, ensure the component uses the provided hooks and is wrapped in the `LanguageProvider`.
- For unsupported locales, the utilities fall back to `en-US`.
- For custom formats, pass an `Intl.DateTimeFormatOptions` or `Intl.NumberFormatOptions` object.

## Example: Formatting in a Table
```tsx
import { useFormatCurrency, useFormatDate } from '@/utils/i18n/formatters';

const formatCurrency = useFormatCurrency();
const formatDate = useFormatDate();

return (
  <tr>
    <td>{formatDate(order.date, 'LONG')}</td>
    <td>{formatCurrency(order.total)}</td>
  </tr>
);
```

## See Also
- [MDN Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [MDN Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
- [MDN Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat)

# Translation Verification Tools

## Overview

The NortechCommunity project includes a comprehensive set of tools for verifying translation completeness, correctness, and developer experience. These tools help ensure all user-facing text is properly internationalized and that missing or unused translations are quickly identified and resolved.

## 1. Translation Scanner

The translation scanner analyzes the codebase to find all translation keys used in the application. It supports various patterns, including:
- `t('key')` and `t('key', { ns: 'namespace' })`
- `useTranslation('namespace')`
- `<Trans i18nKey="key" ns="namespace" />`

### Usage

Run the scanner with:

```bash
npm run scan-translations
```

This will generate a Markdown report (`translation-scan-report.md`) listing:
- All keys used in code
- Keys missing from translation files (per language)
- Unused keys in translation files
- Coverage statistics

Options are available for custom source/translation patterns, exclusions, and verbose output.

## 2. Translation Completeness Checker

The completeness checker compares all used keys against translation files for all supported languages. It identifies:
- Missing translations
- Unused translations
- Empty or inconsistent translations
- Placeholder and HTML tag mismatches

### Usage

Run the checker with:

```bash
npm run check-translations
```

This generates a detailed report in Markdown, JSON, or HTML format. The report includes statistics, a list of issues, and configuration details. Use the `--json` or `--output <file.html>` flags for alternate formats.

## 3. Development Mode Visual Indicators

During development, the system provides real-time visual feedback for missing or problematic translations:
- **Red border / warning icon**: Missing translation
- **Key display**: Shows the translation key next to the text
- **Console warnings**: Logs missing keys and details

### Enabling Debug Mode

- Use the keyboard shortcut: `Ctrl/Cmd + Shift + T`
- Or enable programmatically:

```typescript
import { translationDebugger } from '@/utils/i18n/translationDebugger';
translationDebugger.enable();
```

- Configure options (show keys, highlight missing, log missing, track usage):

```typescript
translationDebugger.setConfig({
  highlightMissing: true,
  showKeys: true,
  logMissing: true,
  trackUsage: true
});
```

- Settings persist in localStorage and can be toggled in the Translation Debug Panel UI.

## 4. DynamicTranslate Component

Use the `<DynamicTranslate />` component to render translations with dev mode visual indicators:

```tsx
<DynamicTranslate translationKey="forms.fields.email" ns="forms" />
```

This component automatically applies debug features in development mode, including key display and missing translation highlighting.

## 5. Integration in Forms and UI

Form components (`FormLabel`, `FormDescription`, `FormMessage`) now use `DynamicTranslate` for all translation rendering, ensuring that missing keys are visually indicated during development.

## 6. Best Practices

- Run the scanner and checker before each release
- Address missing and unused keys promptly
- Use dev mode indicators to catch untranslated content early
- Document new translation patterns and update this README as needed

## 7. Example Workflow

1. Implement new UI with translation keys
2. Run `npm run scan-translations` to find missing/unused keys
3. Run `npm run check-translations` for a full verification report
4. Use dev mode to visually inspect translations in the app
5. Fix issues and rerun tools until all checks pass

---

For more details, see the code in `src/utils/i18n/translationScanner.ts`, `src/utils/i18n/translationChecker.ts`, `src/components/DynamicTranslate.tsx`, and the scripts in `src/scripts/`. 