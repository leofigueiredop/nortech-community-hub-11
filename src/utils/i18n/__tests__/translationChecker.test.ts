import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TranslationChecker } from '../translationChecker';
import fs from 'fs';
import { glob } from 'glob';

// Mock fs and glob
vi.mock('fs');
vi.mock('glob');

describe('TranslationChecker', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('check', () => {
    it('should detect missing placeholders', () => {
      const mockSourceFiles = ['src/components/Test.tsx'];
      const mockTranslationFiles = [
        'public/locales/en-US/common.json',
        'public/locales/pt-BR/common.json'
      ];

      const mockSourceContent = `
        function MyComponent() {
          return t('greeting', { name: 'John' });
        }
      `;

      const mockEnTranslations = {
        greeting: 'Hello, {{name}}!'
      };

      const mockPtTranslations = {
        greeting: 'Olá!'  // Missing placeholder
      };

      vi.mocked(glob.sync)
        .mockReturnValueOnce(mockSourceFiles)  // For source files
        .mockReturnValueOnce(mockTranslationFiles)  // For all translation files
        .mockReturnValueOnce(['public/locales/en-US/common.json'])  // For base language
        .mockReturnValueOnce(mockTranslationFiles);  // For comparison

      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(mockSourceContent)  // Source file
        .mockReturnValueOnce(JSON.stringify(mockEnTranslations))  // en-US translations
        .mockReturnValueOnce(JSON.stringify(mockEnTranslations))  // en-US translations again
        .mockReturnValueOnce(JSON.stringify(mockPtTranslations));  // pt-BR translations

      const checker = new TranslationChecker();
      const result = checker.check();

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'inconsistent',
          key: 'greeting',
          language: 'pt-BR',
          details: expect.stringContaining('Missing placeholder "{{name}}"'),
          severity: 'error'
        })
      );
    });

    it('should detect missing HTML tags', () => {
      const mockSourceFiles = ['src/components/Test.tsx'];
      const mockTranslationFiles = [
        'public/locales/en-US/common.json',
        'public/locales/pt-BR/common.json'
      ];

      const mockSourceContent = `
        function MyComponent() {
          return t('welcome');
        }
      `;

      const mockEnTranslations = {
        welcome: 'Welcome to <strong>our app</strong>!'
      };

      const mockPtTranslations = {
        welcome: 'Bem-vindo ao nosso app!'  // Missing HTML tags
      };

      vi.mocked(glob.sync)
        .mockReturnValueOnce(mockSourceFiles)
        .mockReturnValueOnce(mockTranslationFiles)
        .mockReturnValueOnce(['public/locales/en-US/common.json'])
        .mockReturnValueOnce(mockTranslationFiles);

      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(mockSourceContent)
        .mockReturnValueOnce(JSON.stringify(mockEnTranslations))
        .mockReturnValueOnce(JSON.stringify(mockEnTranslations))
        .mockReturnValueOnce(JSON.stringify(mockPtTranslations));

      const checker = new TranslationChecker();
      const result = checker.check();

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'inconsistent',
          key: 'welcome',
          language: 'pt-BR',
          details: expect.stringContaining('Missing HTML tag "<strong>"'),
          severity: 'error'
        })
      );
    });

    it('should detect empty translations', () => {
      const mockSourceFiles = ['src/components/Test.tsx'];
      const mockTranslationFiles = [
        'public/locales/en-US/common.json',
        'public/locales/pt-BR/common.json'
      ];

      const mockSourceContent = `
        function MyComponent() {
          return t('greeting');
        }
      `;

      const mockEnTranslations = {
        greeting: 'Hello!'
      };

      const mockPtTranslations = {
        greeting: ''  // Empty translation
      };

      vi.mocked(glob.sync)
        .mockReturnValueOnce(mockSourceFiles)
        .mockReturnValueOnce(mockTranslationFiles)
        .mockReturnValueOnce(['public/locales/en-US/common.json'])
        .mockReturnValueOnce(mockTranslationFiles);

      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(mockSourceContent)
        .mockReturnValueOnce(JSON.stringify(mockEnTranslations))
        .mockReturnValueOnce(JSON.stringify(mockEnTranslations))
        .mockReturnValueOnce(JSON.stringify(mockPtTranslations));

      const checker = new TranslationChecker();
      const result = checker.check();

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'empty',
          key: 'greeting',
          language: 'pt-BR',
          details: 'Empty translation string',
          severity: 'warning'
        })
      );
    });

    it('should handle nested translations', () => {
      const mockSourceFiles = ['src/components/Test.tsx'];
      const mockTranslationFiles = [
        'public/locales/en-US/common.json',
        'public/locales/pt-BR/common.json'
      ];

      const mockSourceContent = `
        function MyComponent() {
          return t('form.submit');
        }
      `;

      const mockEnTranslations = {
        form: {
          submit: 'Submit',
          cancel: 'Cancel'
        }
      };

      const mockPtTranslations = {
        form: {
          submit: 'Enviar',
          // Missing cancel translation
        }
      };

      vi.mocked(glob.sync)
        .mockReturnValueOnce(mockSourceFiles)
        .mockReturnValueOnce(mockTranslationFiles)
        .mockReturnValueOnce(['public/locales/en-US/common.json'])
        .mockReturnValueOnce(mockTranslationFiles);

      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(mockSourceContent)
        .mockReturnValueOnce(JSON.stringify(mockEnTranslations))
        .mockReturnValueOnce(JSON.stringify(mockEnTranslations))
        .mockReturnValueOnce(JSON.stringify(mockPtTranslations));

      const checker = new TranslationChecker();
      const result = checker.check();

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'missing',
          key: 'form.cancel',
          language: 'pt-BR',
          severity: 'error'
        })
      );
    });

    it('should respect ignore patterns', () => {
      const mockSourceFiles = ['src/components/Test.tsx'];
      const mockTranslationFiles = [
        'public/locales/en-US/common.json',
        'public/locales/pt-BR/common.json'
      ];

      const mockSourceContent = `
        function MyComponent() {
          return t('debug.message');
        }
      `;

      const mockEnTranslations = {
        debug: {
          message: 'Debug message'
        }
      };

      const mockPtTranslations = {
        // Missing debug.message, but should be ignored
      };

      vi.mocked(glob.sync)
        .mockReturnValueOnce(mockSourceFiles)
        .mockReturnValueOnce(mockTranslationFiles)
        .mockReturnValueOnce(['public/locales/en-US/common.json'])
        .mockReturnValueOnce(mockTranslationFiles);

      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(mockSourceContent)
        .mockReturnValueOnce(JSON.stringify(mockEnTranslations))
        .mockReturnValueOnce(JSON.stringify(mockEnTranslations))
        .mockReturnValueOnce(JSON.stringify(mockPtTranslations));

      const checker = new TranslationChecker(
        undefined,
        undefined,
        undefined,
        {
          ignorePatterns: [/^debug\./]
        }
      );
      const result = checker.check();

      // Should not report any issues for ignored keys
      expect(result.issues.filter(i => i.key.startsWith('debug.'))).toHaveLength(0);
    });

    it('should calculate correct statistics', () => {
      const mockSourceFiles = ['src/components/Test.tsx'];
      const mockTranslationFiles = [
        'public/locales/en-US/common.json',
        'public/locales/pt-BR/common.json'
      ];

      const mockSourceContent = `
        function MyComponent() {
          return (
            <>
              {t('greeting')}
              {t('welcome')}
              {t('missing')}
            </>
          );
        }
      `;

      const mockEnTranslations = {
        greeting: 'Hello!',
        welcome: 'Welcome!',
        unused: 'Unused'
      };

      const mockPtTranslations = {
        greeting: '',  // Empty
        welcome: 'Bem-vindo!'
        // Missing 'missing' key
      };

      vi.mocked(glob.sync)
        .mockReturnValueOnce(mockSourceFiles)
        .mockReturnValueOnce(mockTranslationFiles)
        .mockReturnValueOnce(['public/locales/en-US/common.json'])
        .mockReturnValueOnce(mockTranslationFiles);

      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(mockSourceContent)
        .mockReturnValueOnce(JSON.stringify(mockEnTranslations))
        .mockReturnValueOnce(JSON.stringify(mockEnTranslations))
        .mockReturnValueOnce(JSON.stringify(mockPtTranslations));

      const checker = new TranslationChecker();
      const result = checker.check();

      expect(result.stats['pt-BR']).toEqual(
        expect.objectContaining({
          totalKeys: 3,  // greeting, welcome, unused
          missingKeys: 1,  // missing
          unusedKeys: 1,  // unused
          emptyKeys: 1,  // greeting
          inconsistentKeys: 0,
          invalidKeys: 0,
          completionPercentage: expect.any(Number)
        })
      );

      // Verify completion percentage calculation
      expect(result.stats['pt-BR'].completionPercentage).toBe(
        ((3 - 1) / 3) * 100  // (totalKeys - missingKeys) / totalKeys * 100
      );
    });
  });
}); 