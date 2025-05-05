import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import type { SupportedLanguage } from './supportedLanguages';
import { TranslationScanner } from './translationScanner';

interface TranslationIssue {
  type: 'missing' | 'unused' | 'empty' | 'inconsistent' | 'invalid';
  key: string;
  namespace?: string;
  language?: string;
  file?: string;
  line?: number;
  details: string;
  severity: 'error' | 'warning' | 'info';
}

interface TranslationStats {
  totalKeys: number;
  missingKeys: number;
  unusedKeys: number;
  emptyKeys: number;
  inconsistentKeys: number;
  invalidKeys: number;
  completionPercentage: number;
}

interface CheckResult {
  issues: TranslationIssue[];
  stats: Record<string, TranslationStats>;
  timestamp: string;
}

export class TranslationChecker {
  private scanner: TranslationScanner;
  private config: {
    ignoreKeys: string[];
    ignorePatterns: RegExp[];
    requireAllLanguages: boolean;
    validatePlaceholders: boolean;
    validateHtml: boolean;
    baseLanguage: SupportedLanguage;
  };

  constructor(
    sourcePattern: string = 'src/**/*.{ts,tsx,js,jsx}',
    translationPattern: string = 'public/locales/**/*.json',
    excludePatterns: string[] = ['**/node_modules/**', '**/__tests__/**', '**/*.test.*', '**/*.spec.*'],
    config: Partial<TranslationChecker['config']> = {}
  ) {
    this.scanner = new TranslationScanner(sourcePattern, translationPattern, excludePatterns);
    this.config = {
      ignoreKeys: [],
      ignorePatterns: [],
      requireAllLanguages: true,
      validatePlaceholders: true,
      validateHtml: true,
      baseLanguage: 'en-US',
      ...config
    };
  }

  /**
   * Check if a key should be ignored based on configuration
   */
  private shouldIgnoreKey(key: string): boolean {
    if (this.config.ignoreKeys.includes(key)) return true;
    return this.config.ignorePatterns.some(pattern => pattern.test(key));
  }

  /**
   * Validate placeholders in translation strings
   */
  private validatePlaceholders(
    key: string,
    baseValue: string,
    compareValue: string,
    language: string
  ): TranslationIssue[] {
    const issues: TranslationIssue[] = [];
    
    // Match {{variable}}, {variable}, and $t(key) patterns
    const placeholderPattern = /\{\{([^}]+)\}\}|\{([^}]+)\}|\$t\([^)]+\)/g;
    const basePlaceholders = [...baseValue.matchAll(placeholderPattern)].map(m => m[0]);
    const comparePlaceholders = [...compareValue.matchAll(placeholderPattern)].map(m => m[0]);

    // Check for missing placeholders
    basePlaceholders.forEach(placeholder => {
      if (!comparePlaceholders.includes(placeholder)) {
        issues.push({
          type: 'inconsistent',
          key,
          language,
          details: `Missing placeholder "${placeholder}" in translation`,
          severity: 'error'
        });
      }
    });

    // Check for extra placeholders
    comparePlaceholders.forEach(placeholder => {
      if (!basePlaceholders.includes(placeholder)) {
        issues.push({
          type: 'inconsistent',
          key,
          language,
          details: `Extra placeholder "${placeholder}" in translation`,
          severity: 'error'
        });
      }
    });

    return issues;
  }

  /**
   * Validate HTML tags in translation strings
   */
  private validateHtml(
    key: string,
    baseValue: string,
    compareValue: string,
    language: string
  ): TranslationIssue[] {
    const issues: TranslationIssue[] = [];
    
    // Match HTML tags
    const tagPattern = /<[^>]+>/g;
    const baseTags = [...baseValue.matchAll(tagPattern)].map(m => m[0]);
    const compareTags = [...compareValue.matchAll(tagPattern)].map(m => m[0]);

    // Check for missing tags
    baseTags.forEach(tag => {
      if (!compareTags.includes(tag)) {
        issues.push({
          type: 'inconsistent',
          key,
          language,
          details: `Missing HTML tag "${tag}" in translation`,
          severity: 'error'
        });
      }
    });

    // Check for extra tags
    compareTags.forEach(tag => {
      if (!baseTags.includes(tag)) {
        issues.push({
          type: 'inconsistent',
          key,
          language,
          details: `Extra HTML tag "${tag}" in translation`,
          severity: 'error'
        });
      }
    });

    return issues;
  }

  /**
   * Compare translations between languages
   */
  private compareTranslations(
    baseTranslations: Record<string, string>,
    compareTranslations: Record<string, string>,
    language: string,
    namespace: string
  ): TranslationIssue[] {
    const issues: TranslationIssue[] = [];

    // Helper function to process nested objects
    const processObject = (
      base: Record<string, any>,
      compare: Record<string, any>,
      prefix = ''
    ) => {
      Object.entries(base).forEach(([key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const compareValue = compare[key];

        if (this.shouldIgnoreKey(fullKey)) {
          return;
        }

        if (typeof value === 'object' && value !== null) {
          if (typeof compareValue !== 'object' || compareValue === null) {
            issues.push({
              type: 'invalid',
              key: fullKey,
              namespace,
              language,
              details: 'Mismatched value type (expected object)',
              severity: 'error'
            });
          } else {
            processObject(value, compareValue, fullKey);
          }
        } else if (typeof value === 'string') {
          if (typeof compareValue !== 'string') {
            issues.push({
              type: 'invalid',
              key: fullKey,
              namespace,
              language,
              details: 'Mismatched value type (expected string)',
              severity: 'error'
            });
          } else if (compareValue === '') {
            issues.push({
              type: 'empty',
              key: fullKey,
              namespace,
              language,
              details: 'Empty translation string',
              severity: 'warning'
            });
          } else {
            // Validate placeholders if enabled
            if (this.config.validatePlaceholders) {
              issues.push(...this.validatePlaceholders(fullKey, value, compareValue, language));
            }

            // Validate HTML if enabled
            if (this.config.validateHtml) {
              issues.push(...this.validateHtml(fullKey, value, compareValue, language));
            }
          }
        }
      });
    };

    processObject(baseTranslations, compareTranslations);
    return issues;
  }

  /**
   * Calculate statistics for translation completeness
   */
  private calculateStats(
    scanResult: ReturnType<TranslationScanner['scan']>,
    issues: TranslationIssue[]
  ): Record<string, TranslationStats> {
    const stats: Record<string, TranslationStats> = {};

    Object.entries(scanResult.definedKeys).forEach(([lang, keys]) => {
      const langIssues = issues.filter(issue => issue.language === lang);
      
      stats[lang] = {
        totalKeys: keys.length,
        missingKeys: langIssues.filter(i => i.type === 'missing').length,
        unusedKeys: langIssues.filter(i => i.type === 'unused').length,
        emptyKeys: langIssues.filter(i => i.type === 'empty').length,
        inconsistentKeys: langIssues.filter(i => i.type === 'inconsistent').length,
        invalidKeys: langIssues.filter(i => i.type === 'invalid').length,
        completionPercentage: ((keys.length - langIssues.filter(i => i.type === 'missing').length) / keys.length) * 100
      };
    });

    return stats;
  }

  /**
   * Check translations for completeness and consistency
   */
  public check(): CheckResult {
    const scanResult = this.scanner.scan();
    const issues: TranslationIssue[] = [];

    // Add missing and unused key issues from scanner
    Object.entries(scanResult.missingKeys).forEach(([lang, keys]) => {
      keys.forEach(key => {
        if (!this.shouldIgnoreKey(key.key)) {
          issues.push({
            type: 'missing',
            key: key.key,
            namespace: key.namespace,
            language: lang,
            file: key.file,
            line: key.line,
            details: 'Translation key not found in language file',
            severity: 'error'
          });
        }
      });
    });

    Object.entries(scanResult.unusedKeys).forEach(([lang, keys]) => {
      keys.forEach(key => {
        if (!this.shouldIgnoreKey(key)) {
          issues.push({
            type: 'unused',
            key,
            language: lang,
            details: 'Translation key not used in code',
            severity: 'warning'
          });
        }
      });
    });

    // Load and compare translations
    const baseTranslations = new Map<string, Record<string, any>>();
    const compareTranslations = new Map<string, Record<string, any>>();

    // Load base language translations
    glob.sync(`public/locales/${this.config.baseLanguage}/*.json`).forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      const namespace = path.basename(file, '.json');
      baseTranslations.set(namespace, JSON.parse(content));
    });

    // Load and compare other language translations
    glob.sync('public/locales/*/*.json').forEach(file => {
      const pathParts = file.split(path.sep);
      const language = pathParts[pathParts.indexOf('locales') + 1] as SupportedLanguage;
      
      if (language === this.config.baseLanguage) return;

      const content = fs.readFileSync(file, 'utf-8');
      const namespace = path.basename(file, '.json');
      const translations = JSON.parse(content);
      compareTranslations.set(`${language}:${namespace}`, translations);

      const baseTranslation = baseTranslations.get(namespace);
      if (baseTranslation) {
        issues.push(...this.compareTranslations(
          baseTranslation,
          translations,
          language,
          namespace
        ));
      }
    });

    return {
      issues,
      stats: this.calculateStats(scanResult, issues),
      timestamp: new Date().toISOString()
    };
  }
} 