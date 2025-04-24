# Internationalization (i18n) Documentation

This project uses `i18next` and `react-i18next` for internationalization to support multiple languages, currently:
- English (en)
- Brazilian Portuguese (pt-BR)

## How to Use

### Basic Translation
Import the `useTranslation` hook and use the `t` function:

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('common.save')}</h1>; // Output: "Save" or "Salvar" depending on language
}
```

### Language Switching
To programmatically change the language:

```tsx
import { useLanguage } from '@/context/LanguageContext';

function LanguageSwitch() {
  const { language, changeLanguage } = useLanguage();
  
  return (
    <button onClick={() => changeLanguage('pt-BR')}>
      Switch to Portuguese
    </button>
  );
}
```

## Adding New Translations

1. Locate the JSON files in `/src/locales/` directory
2. Add your new key-value pairs to both `en.json` and `pt-BR.json` files
3. Use nested objects to organize translations logically

Example:
```json
{
  "section": {
    "subsection": {
      "key": "Translation value"
    }
  }
}
```

Access with: `t('section.subsection.key')`

## Translation Structure

We use a nested structure for translations:

- `common`: Reusable elements like button labels, common actions
- `header`: Header-related elements
- `sidebar`: Sidebar navigation items
- `settings`: Settings page sections and elements
  - `general`: General settings
  - `branding`: Branding settings
  - etc.

## Adding New Languages

1. Create a new file in the `/src/locales/` directory (e.g., `fr.json` for French)
2. Copy the structure from `en.json` and translate all values
3. Add the language to the i18n configuration in `src/i18n.ts`

```typescript
// Add to resources in i18n.ts
resources: {
  // existing languages...
  'fr': {
    translation: frTranslation,
  },
},
```

## Best Practices

- Always use translation keys instead of hardcoded text
- Keep translation keys organized by feature or component
- Always add new keys to all language files
- Use interpolation for dynamic values: `t('welcome', { name: 'John' })`
