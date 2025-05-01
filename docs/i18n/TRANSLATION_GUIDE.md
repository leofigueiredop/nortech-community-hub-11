# Translation Management Guide

This guide outlines the standards and best practices for managing translations in the Nortech Community project.

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Translation Namespaces](#translation-namespaces)
3. [Type System](#type-system)
4. [Adding New Translations](#adding-new-translations)
5. [Using Translations](#using-translations)
6. [Best Practices](#best-practices)

## Directory Structure

Translations are organized in the following structure:

```
public/
  locales/
    en-US/           # English translations
      common.json    # Common translations
      forms.json     # Form-related translations
      features.json  # Feature-specific translations
      auth.json      # Authentication-related translations
      navigation.json # Navigation-related translations
    pt-BR/           # Portuguese translations
      ...           # Same structure as en-US
```

## Translation Namespaces

We use the following namespaces to organize translations:

### 1. Common (`common.json`)
- General-purpose translations used across the application
- Includes actions, status messages, notifications, time-related text
- Example: buttons, loading states, error messages

### 2. Forms (`forms.json`)
- Form-related translations
- Includes labels, placeholders, validation messages
- Used in any form throughout the application

### 3. Features (`features.json`)
- Feature-specific translations
- Organized by feature (events, discussions, points)
- Includes all text specific to feature functionality

### 4. Auth (`auth.json`)
- Authentication-related translations
- Includes sign-in, sign-up, password reset
- Error messages specific to authentication

### 5. Navigation (`navigation.json`)
- Navigation-related translations
- Menu items, breadcrumbs
- Route-specific text

## Type System

We use TypeScript to ensure type safety in our translations:

```typescript
// src/types/i18n.ts
interface ICommonTranslation {
  meta: {
    title: string;
    description: string;
  };
  actions: {
    view: string;
    edit: string;
    // ...
  };
  // ...
}

// Usage with type safety
const { t } = useTranslation('common');
t('actions.edit'); // TypeScript will ensure this key exists
```

## Adding New Translations

1. Add the translation key to the appropriate namespace in `en-US/`
2. Add the corresponding translation in `pt-BR/`
3. Update the TypeScript interfaces in `src/types/i18n.ts`
4. Use the new translation in your component

Example:
```typescript
// 1. Add to en-US/features.json
{
  "events": {
    "new": {
      "title": "New Event"
    }
  }
}

// 2. Add to pt-BR/features.json
{
  "events": {
    "new": {
      "title": "Novo Evento"
    }
  }
}

// 3. Update src/types/i18n.ts
interface IFeaturesTranslation {
  events: {
    new: {
      title: string;
    };
  };
}

// 4. Use in component
const { t } = useTranslation('features');
<h1>{t('events.new.title')}</h1>
```

## Using Translations

### Single Namespace

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common');
  return <button>{t('actions.save')}</button>;
}
```

### Multiple Namespaces

```typescript
import { useTranslation } from 'react-i18next';
import { mergeNamespaces } from '@/utils/i18n/mergeNamespaces';

function MyComponent() {
  const { t: commonT } = useTranslation('common');
  const { t: formsT } = useTranslation('forms');
  
  const { t } = mergeNamespaces({
    common: commonT,
    forms: formsT,
  });

  return (
    <form>
      <h2>{t.common.actions.save}</h2>
      <label>{t.forms.labels.email}</label>
    </form>
  );
}
```

## Best Practices

### 1. Key Organization
- Use descriptive, hierarchical keys
- Group related translations
- Keep nesting to a maximum of 3-4 levels
```json
{
  "feature": {
    "section": {
      "action": "Text"
    }
  }
}
```

### 2. String Formatting
- Use sentence case for most text
- Use title case for headings and buttons
- Be consistent with punctuation
- End complete sentences with periods
- Don't end button/label text with periods

### 3. Variables
- Use descriptive variable names
- Document required variables in comments
```json
{
  "welcome": "Welcome, {{name}}!",  // Requires: name
  "count": "{{count}} items"        // Requires: count
}
```

### 4. Pluralization
- Always consider plural forms
- Use i18next plural syntax
```json
{
  "items": {
    "one": "{{count}} item",
    "other": "{{count}} items"
  }
}
```

### 5. Maintenance
- Keep translations in sync across languages
- Remove unused translations
- Document context for translators
- Use comments for complex strings

### 6. Type Safety
- Always update TypeScript interfaces
- Use strict type checking
- Leverage IDE autocompletion
- Test type coverage

### 7. Performance
- Load namespaces only when needed
- Use code splitting with translations
- Consider lazy loading for rarely used translations

## Contributing

When contributing new features:

1. Add all required translations to both language files
2. Update type definitions
3. Follow the naming conventions
4. Add comments for context
5. Test with both languages
6. Update this documentation if needed

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [React i18next](https://react.i18next.com/)
- [TypeScript Integration](https://www.i18next.com/overview/typescript) 