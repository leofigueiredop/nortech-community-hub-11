import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TranslationScanner } from '../translationScanner';
import fs from 'fs';
import { glob } from 'glob';

// Mock fs and glob
vi.mock('fs');
vi.mock('glob');

describe('TranslationScanner', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('scanSourceFiles', () => {
    it('should detect t() function calls with namespace', () => {
      const mockFiles = ['src/components/Test.tsx'];
      const mockContent = `
        function MyComponent() {
          const { t } = useTranslation();
          return t('greeting', { ns: 'common' });
        }
      `;

      vi.mocked(glob.sync).mockReturnValue(mockFiles);
      vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

      const scanner = new TranslationScanner();
      const result = scanner.scan();

      expect(result.usedKeys).toContainEqual(
        expect.objectContaining({
          key: 'greeting',
          namespace: 'common',
          file: mockFiles[0]
        })
      );
    });

    it('should detect useTranslation hook calls', () => {
      const mockFiles = ['src/components/Test.tsx'];
      const mockContent = `
        function MyComponent() {
          const { t } = useTranslation('common');
          return t('greeting');
        }
      `;

      vi.mocked(glob.sync).mockReturnValue(mockFiles);
      vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

      const scanner = new TranslationScanner();
      const result = scanner.scan();

      expect(result.usedKeys).toContainEqual(
        expect.objectContaining({
          key: '*',
          namespace: 'common',
          file: mockFiles[0]
        })
      );
    });

    it('should detect Trans component usage', () => {
      const mockFiles = ['src/components/Test.tsx'];
      const mockContent = `
        function MyComponent() {
          return (
            <Trans i18nKey="welcome" ns="common">
              Welcome to our app
            </Trans>
          );
        }
      `;

      vi.mocked(glob.sync).mockReturnValue(mockFiles);
      vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

      const scanner = new TranslationScanner();
      const result = scanner.scan();

      expect(result.usedKeys).toContainEqual(
        expect.objectContaining({
          key: 'welcome',
          namespace: 'common',
          file: mockFiles[0]
        })
      );
    });
  });

  describe('loadTranslationFiles', () => {
    it('should load and parse translation files correctly', () => {
      const mockTranslationFiles = [
        'public/locales/en-US/common.json',
        'public/locales/pt-BR/common.json'
      ];

      const mockEnTranslations = {
        greeting: 'Hello',
        welcome: {
          title: 'Welcome',
          message: 'Welcome to our app'
        }
      };

      const mockPtTranslations = {
        greeting: 'Olá',
        welcome: {
          title: 'Bem-vindo',
          message: 'Bem-vindo ao nosso app'
        }
      };

      vi.mocked(glob.sync).mockReturnValue(mockTranslationFiles);
      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(JSON.stringify(mockEnTranslations))
        .mockReturnValueOnce(JSON.stringify(mockPtTranslations));

      const scanner = new TranslationScanner();
      const result = scanner.scan();

      expect(result.definedKeys['en-US']).toContain('common:greeting');
      expect(result.definedKeys['en-US']).toContain('common:welcome.title');
      expect(result.definedKeys['en-US']).toContain('common:welcome.message');
      expect(result.definedKeys['pt-BR']).toContain('common:greeting');
      expect(result.definedKeys['pt-BR']).toContain('common:welcome.title');
      expect(result.definedKeys['pt-BR']).toContain('common:welcome.message');
    });
  });

  describe('compareKeys', () => {
    it('should identify missing and unused keys', () => {
      const mockFiles = ['src/components/Test.tsx'];
      const mockContent = `
        function MyComponent() {
          const { t } = useTranslation('common');
          return (
            <>
              {t('greeting')}
              {t('missing_key')}
            </>
          );
        }
      `;

      const mockTranslationFiles = [
        'public/locales/en-US/common.json',
        'public/locales/pt-BR/common.json'
      ];

      const mockTranslations = {
        greeting: 'Hello',
        unused_key: 'Unused'
      };

      vi.mocked(glob.sync)
        .mockReturnValueOnce(mockFiles)
        .mockReturnValueOnce(mockTranslationFiles);

      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(mockContent)
        .mockReturnValueOnce(JSON.stringify(mockTranslations))
        .mockReturnValueOnce(JSON.stringify(mockTranslations));

      const scanner = new TranslationScanner();
      const result = scanner.scan();

      // Check missing keys
      expect(result.missingKeys['en-US']).toContainEqual(
        expect.objectContaining({
          key: 'missing_key'
        })
      );

      // Check unused keys
      expect(result.unusedKeys['en-US']).toContain('common:unused_key');
    });

    it('should handle namespace-only entries correctly', () => {
      const mockFiles = ['src/components/Test.tsx'];
      const mockContent = `
        function MyComponent() {
          const { t } = useTranslation('common');
          return t('greeting');
        }
      `;

      const mockTranslationFiles = ['public/locales/en-US/common.json'];
      const mockTranslations = {
        greeting: 'Hello',
        other_key: 'Other'
      };

      vi.mocked(glob.sync)
        .mockReturnValueOnce(mockFiles)
        .mockReturnValueOnce(mockTranslationFiles);

      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(mockContent)
        .mockReturnValueOnce(JSON.stringify(mockTranslations));

      const scanner = new TranslationScanner();
      const result = scanner.scan();

      // Should not mark other_key as unused because namespace is used
      expect(result.unusedKeys['en-US']).not.toContain('common:other_key');
    });
  });
}); 