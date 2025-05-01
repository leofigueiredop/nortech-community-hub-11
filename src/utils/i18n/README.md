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