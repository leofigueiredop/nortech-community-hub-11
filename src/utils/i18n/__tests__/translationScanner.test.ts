import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TranslationScanner } from '../translationScanner';
import fs from 'fs';
import { glob } from 'glob';

// Mock fs and glob
vi.mock('fs');
vi.mock('glob', () => ({
  glob: {
    sync: vi.fn()
  }
}));

describe('TranslationScanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('scanSourceFiles', () => {
    it('should find translation keys in source files', () => {
      // Mock file content with translation keys
      const mockContent = `
        import { useTranslation } from 'react-i18next';
        
        function MyComponent() {
          const { t } = useTranslation('common');
          return (
            <div>
              {t('greeting')}
              {t('welcome', { ns: 'auth' })}
            </div>
          );
        }
      `;

      // Mock glob and fs
      vi.mocked(glob.sync).mockReturnValue(['src/components/MyComponent.tsx']);
      vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

      const scanner = new TranslationScanner();
      const result = scanner.scan();

      expect(result.usedKeys).toHaveLength(2);
      expect(result.usedKeys).toContainEqual(
        expect.objectContaining({
          key: 'greeting',
          file: 'src/components/MyComponent.tsx'
        })
      );
      expect(result.usedKeys).toContainEqual(
        expect.objectContaining({
          key: 'welcome',
          namespace: 'auth',
          file: 'src/components/MyComponent.tsx'
        })
      );
    });
  });

  describe('loadTranslationFiles', () => {
    it('should load and parse translation files', () => {
      // Mock translation files
      const mockTranslations = {
        'public/locales/en-US/common.json': {
          greeting: 'Hello',
          welcome: 'Welcome'
        },
        'public/locales/pt-BR/common.json': {
          greeting: 'Olá',
          welcome: 'Bem-vindo'
        }
      };

      // Mock glob and fs
      vi.mocked(glob.sync).mockReturnValue(Object.keys(mockTranslations));
      vi.mocked(fs.readFileSync).mockImplementation((file) => 
        JSON.stringify(mockTranslations[file as keyof typeof mockTranslations])
      );

      const scanner = new TranslationScanner();
      const result = scanner.scan();

      expect(Object.keys(result.definedKeys)).toEqual(['en-US', 'pt-BR']);
      expect(result.definedKeys['en-US']).toContain('common:greeting');
      expect(result.definedKeys['pt-BR']).toContain('common:welcome');
    });
  });

  describe('compareKeys', () => {
    it('should identify missing and unused keys', () => {
      // Mock source files with translation keys
      const mockContent = `
        function MyComponent() {
          return (
            <div>
              {t('greeting')}
              {t('missing_key')}
            </div>
          );
        }
      `;

      // Mock translation files
      const mockTranslations = {
        'public/locales/en-US/common.json': {
          greeting: 'Hello',
          unused_key: 'Not Used'
        }
      };

      // Mock glob and fs
      vi.mocked(glob.sync)
        .mockReturnValueOnce(['src/components/MyComponent.tsx']) // For source files
        .mockReturnValueOnce(Object.keys(mockTranslations)); // For translation files
      
      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(mockContent) // For source file
        .mockReturnValueOnce(JSON.stringify(mockTranslations['public/locales/en-US/common.json'])); // For translation file

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
  });
}); 