# Translation Debugging System

This document provides a comprehensive guide to using the translation debugging tools in our React application.

## Table of Contents

1. [Overview](#overview)
2. [Debug Mode](#debug-mode)
3. [Translation Scanner](#translation-scanner)
4. [Visual Indicators](#visual-indicators)
5. [Developer UI](#developer-ui)
6. [Best Practices](#best-practices)

## Overview

The translation debugging system helps developers identify, track, and fix translation-related issues in the application. It consists of several integrated tools:

- Debug Mode for real-time translation inspection
- Translation Scanner for static analysis
- Visual Indicators for missing or problematic translations
- Developer UI for managing translations

## Debug Mode

### Enabling Debug Mode

Debug mode can be enabled in two ways:

1. Keyboard Shortcut: `Ctrl/Cmd + Shift + T`
2. Programmatically:
```typescript
import { TranslationDebugger } from '../utils/i18n/TranslationDebugger';

TranslationDebugger.getInstance().enable();
```

### Configuration Options

The debug mode supports several configuration options:

```typescript
TranslationDebugger.getInstance().setConfig({
  highlightMissing: true,    // Highlight missing translations
  showKeys: true,            // Show translation keys
  logMissing: true,          // Log missing translations to console
  trackUsage: true           // Track translation usage
});
```

### Persistence

Debug settings are automatically persisted in localStorage under the key `translation-debug-config`. This ensures your settings remain across page reloads.

## Translation Scanner

The Translation Scanner is a CLI tool that analyzes your codebase for:

- Missing translations
- Unused translations
- Formatting issues
- Namespace conflicts

### Running the Scanner

```bash
npm run scan-translations
```

### Configuration

The scanner can be configured in `scripts/scanTranslations.ts`:

```typescript
{
  sourcePath: 'src',               // Source code directory
  translationPath: 'public/locales', // Translation files directory
  languages: ['en-US', 'pt-BR'],   // Supported languages
  ignore: ['*.test.ts', '*.spec.ts'] // Files to ignore
}
```

## Visual Indicators

The visual indicator system provides real-time feedback about translation status:

### Border Colors

- 🔴 Red: Missing translation
- 🟡 Yellow: Fallback translation being used
- 🟢 Green: Translation found in correct language

### Tooltips

Hover over highlighted elements to see:

- Translation key
- Source file
- Component name
- Warning details (if any)

### Console Warnings

When `logMissing` is enabled, the system logs detailed warnings:

```typescript
[Translation Warning] Missing key "welcome.title" in namespace "common"
  Component: Header
  File: src/components/Header.tsx:15
```

## Developer UI

The Translation Debug Panel provides a comprehensive interface for managing translations:

### Features

1. **Real-time Editing**
   - Edit translations directly in the UI
   - Changes are saved to the translation files
   - Visual indicator for unsaved changes

2. **Search and Filter**
   - Search by key or content
   - Filter by namespace
   - Sort by usage or status

3. **Export/Import**
   - Export translations to JSON
   - Copy translation keys with proper format
   - Track translation usage statistics

4. **Navigation**
   - Quick namespace switching
   - Recently used translations
   - Missing translations overview

### Usage Tips

1. Use the search bar to quickly find specific translations
2. Export translations before making bulk changes
3. Use the namespace filter to focus on specific sections
4. Check the "dirty" indicator (●) for unsaved changes

## Best Practices

1. **Regular Scanning**
   - Run the translation scanner before commits
   - Address missing translations promptly
   - Keep translation files organized by namespace

2. **Debug Mode Usage**
   - Enable during development
   - Use visual indicators for quick feedback
   - Check console warnings for details

3. **Translation Management**
   - Use namespaces for logical grouping
   - Keep keys consistent across languages
   - Document special formatting requirements

4. **Performance Considerations**
   - Disable debug mode in production
   - Use the scanner for bulk analysis
   - Clear translation history when not needed

## Troubleshooting

Common issues and solutions:

1. **Missing Translations Not Highlighted**
   - Check if debug mode is enabled
   - Verify `highlightMissing` configuration
   - Clear browser cache and reload

2. **Scanner Not Finding Files**
   - Check `sourcePath` configuration
   - Verify file extensions are included
   - Check ignore patterns

3. **Debug Panel Not Showing**
   - Ensure debug mode is enabled
   - Check keyboard shortcut conflicts
   - Verify browser console for errors

## Contributing

When adding new features to the translation system:

1. Update this documentation
2. Add appropriate tests
3. Consider performance implications
4. Follow the established naming conventions

For more information, see the [Contributing Guide](./CONTRIBUTING.md). 