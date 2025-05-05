import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import type { 
  Node, 
  StringLiteral, 
  ObjectExpression, 
  Identifier, 
  ObjectProperty,
  JSXAttribute,
  JSXIdentifier
} from '@babel/types';
import type { SupportedLanguage } from './supportedLanguages';

interface TranslationKey {
  key: string;
  namespace?: string;
  file: string;
  line: number;
}

interface TranslationFile {
  language: SupportedLanguage;
  namespace: string;
  path: string;
  translations: Record<string, string | Record<string, string>>;
}

interface ScanResult {
  usedKeys: TranslationKey[];
  definedKeys: Record<string, string[]>;
  missingKeys: Record<string, TranslationKey[]>;
  unusedKeys: Record<string, string[]>;
}

export class TranslationScanner {
  private sourcePattern: string;
  private translationPattern: string;
  private excludePatterns: string[];

  constructor(
    sourcePattern: string = 'src/**/*.{ts,tsx,js,jsx}',
    translationPattern: string = 'public/locales/**/*.json',
    excludePatterns: string[] = ['**/node_modules/**', '**/__tests__/**', '**/*.test.*', '**/*.spec.*']
  ) {
    this.sourcePattern = sourcePattern;
    this.translationPattern = translationPattern;
    this.excludePatterns = excludePatterns;
  }

  /**
   * Scan source files for translation key usage
   */
  private scanSourceFiles(): TranslationKey[] {
    const files = glob.sync(this.sourcePattern, { ignore: this.excludePatterns });
    const keys: TranslationKey[] = [];

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx']
      });

      traverse(ast, {
        CallExpression(path) {
          const node = path.node;
          
          // Check for t() function calls
          if (node.callee.type === 'Identifier' && node.callee.name === 't') {
            const args = node.arguments;
            if (args.length > 0 && args[0].type === 'StringLiteral') {
              const keyNode = args[0] as StringLiteral;
              const key = keyNode.value;
              const options = args[1] as ObjectExpression | undefined;
              let namespace;

              // Check for namespace in options
              if (options?.type === 'ObjectExpression') {
                const nsProp = options.properties.find(
                  (p: ObjectProperty) => {
                    const key = p.key as Identifier;
                    return key.name === 'ns' || key.name === 'namespace';
                  }
                );
                if (nsProp && 'value' in nsProp && nsProp.value.type === 'StringLiteral') {
                  namespace = nsProp.value.value;
                }
              }

              keys.push({
                key,
                namespace,
                file,
                line: node.loc?.start.line || 0
              });
            }
          }
          
          // Check for useTranslation hook
          if (node.callee.type === 'Identifier' && node.callee.name === 'useTranslation') {
            const args = node.arguments;
            if (args.length > 0 && args[0].type === 'StringLiteral') {
              const namespace = args[0].value;
              // Track namespace usage
              keys.push({
                key: '*',
                namespace,
                file,
                line: node.loc?.start.line || 0
              });
            }
          }
        },
        // Add support for Trans component
        JSXElement(path) {
          const node = path.node;
          if (
            node.openingElement.name.type === 'JSXIdentifier' && 
            node.openingElement.name.name === 'Trans'
          ) {
            const i18nKey = node.openingElement.attributes.find(
              (attr): attr is JSXAttribute => 
                attr.type === 'JSXAttribute' && 
                attr.name.type === 'JSXIdentifier' && 
                attr.name.name === 'i18nKey'
            );
            
            const i18nKeyValue = i18nKey?.value;
            if (i18nKeyValue?.type === 'StringLiteral') {
              const key = i18nKeyValue.value;
              const namespace = node.openingElement.attributes.find(
                (attr): attr is JSXAttribute => 
                  attr.type === 'JSXAttribute' && 
                  attr.name.type === 'JSXIdentifier' && 
                  attr.name.name === 'ns'
              );

              const namespaceValue = namespace?.value;
              keys.push({
                key,
                namespace: namespaceValue?.type === 'StringLiteral' ? namespaceValue.value : undefined,
                file,
                line: node.loc?.start.line || 0
              });
            }
          }
        }
      });
    });

    return keys;
  }

  /**
   * Load translation files
   */
  private loadTranslationFiles(): TranslationFile[] {
    const files = glob.sync(this.translationPattern);
    const translations: TranslationFile[] = [];

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(content);
      const pathParts = file.split(path.sep);
      const language = pathParts[pathParts.indexOf('locales') + 1] as SupportedLanguage;
      const namespace = path.basename(file, '.json');

      translations.push({
        language,
        namespace,
        path: file,
        translations: parsed
      });
    });

    return translations;
  }

  /**
   * Compare used keys with translation files
   */
  private compareKeys(
    usedKeys: TranslationKey[],
    translationFiles: TranslationFile[]
  ): {
    missingKeys: Record<string, TranslationKey[]>;
    unusedKeys: Record<string, string[]>;
    definedKeys: Record<string, string[]>;
  } {
    const missingKeys: Record<string, TranslationKey[]> = {};
    const unusedKeys: Record<string, string[]> = {};
    const definedKeys: Record<string, string[]> = {};

    // Group translation files by language
    const translationsByLang = translationFiles.reduce((acc, file) => {
      if (!acc[file.language]) acc[file.language] = [];
      acc[file.language].push(file);
      return acc;
    }, {} as Record<string, TranslationFile[]>);

    // Check for missing keys
    Object.entries(translationsByLang).forEach(([lang, files]) => {
      missingKeys[lang] = [];
      unusedKeys[lang] = [];
      definedKeys[lang] = [];

      // Build a map of all defined keys
      const definedKeysMap = new Map<string, boolean>();
      files.forEach(file => {
        const addKeys = (obj: Record<string, string | Record<string, string>>, prefix = '') => {
          Object.keys(obj).forEach(key => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];
            
            if (typeof value === 'object') {
              // Handle nested translations
              addKeys(value as Record<string, string>, fullKey);
            } else {
              const namespaceKey = `${file.namespace}:${fullKey}`;
              definedKeysMap.set(namespaceKey, true);
              definedKeys[lang].push(namespaceKey);
            }
          });
        };
        
        addKeys(file.translations);
      });

      // Check each used key
      usedKeys.forEach(key => {
        if (key.key === '*') return; // Skip namespace-only entries
        const fullKey = key.namespace ? `${key.namespace}:${key.key}` : key.key;
        if (!definedKeysMap.has(fullKey)) {
          missingKeys[lang].push(key);
        }
      });

      // Find unused keys
      definedKeys[lang].forEach(key => {
        const [namespace, keyName] = key.split(':');
        const isUsed = usedKeys.some(
          used => 
            (used.key === keyName || used.key === '*') && 
            (!used.namespace || used.namespace === namespace)
        );
        if (!isUsed) {
          unusedKeys[lang].push(key);
        }
      });
    });

    return { missingKeys, unusedKeys, definedKeys };
  }

  /**
   * Scan the codebase for translation keys and compare with translation files
   */
  public scan(): ScanResult {
    const usedKeys = this.scanSourceFiles();
    const translationFiles = this.loadTranslationFiles();
    const { missingKeys, unusedKeys, definedKeys } = this.compareKeys(usedKeys, translationFiles);

    return {
      usedKeys,
      definedKeys,
      missingKeys,
      unusedKeys
    };
  }
} 