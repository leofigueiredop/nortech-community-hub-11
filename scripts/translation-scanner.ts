#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import glob from 'glob';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';

interface TranslationKey {
  key: string;
  namespace?: string;
  occurrences: {
    filePath: string;
    lineNumber: number;
    context: string;
  }[];
}

interface ScannerOptions {
  include?: string[];
  exclude?: string[];
  verbose?: boolean;
}

class TranslationScanner {
  private translationKeys: Map<string, TranslationKey> = new Map();
  private readonly options: ScannerOptions;

  // Regex patterns for different translation function calls
  private readonly patterns = [
    // t('key') or t("key")
    /\bt\(['"]([^'"]+)['"]\)/g,
    // t(['namespace', 'key']) or t(["namespace", "key"])
    /\bt\(\s*\[['"]([^'"]+)['"],\s*['"]([^'"]+)['"]\]\s*\)/g,
    // useTranslation('namespace').t('key')
    /useTranslation\(['"]([^'"]+)['"]\).*?\.t\(['"]([^'"]+)['"]\)/g,
    // i18n.t('key') or i18next.t('key')
    /(?:i18n|i18next)\.t\(['"]([^'"]+)['"]\)/g,
    // Trans components: <Trans i18nKey="key">
    /<Trans\s+i18nKey=['"]([^'"]+)['"]/g,
  ];

  constructor(options: ScannerOptions = {}) {
    this.options = {
      include: options.include || ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: options.exclude || ['**/node_modules/**', '**/dist/**', '**/build/**'],
      verbose: options.verbose || false,
    };
  }

  private log(message: string, type: 'info' | 'error' | 'warning' = 'info') {
    if (!this.options.verbose && type === 'info') return;

    const colors = {
      info: chalk.blue,
      error: chalk.red,
      warning: chalk.yellow,
    };

    console.log(colors[type](`[${type.toUpperCase()}] ${message}`));
  }

  private async findFiles(): Promise<string[]> {
    const files: string[] = [];
    
    for (const pattern of this.options.include!) {
      const matches = await new Promise<string[]>((resolve, reject) => {
        glob(pattern, {
          ignore: this.options.exclude,
          nodir: true,
        }, (err, matches) => {
          if (err) reject(err);
          else resolve(matches);
        });
      });
      files.push(...matches);
    }

    return [...new Set(files)]; // Remove duplicates
  }

  private extractKeysFromContent(content: string, filePath: string): void {
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      this.patterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          try {
            const key = match[2] || match[1]; // match[2] exists for namespace patterns
            const namespace = match[2] ? match[1] : undefined;
            const fullKey = namespace ? `${namespace}:${key}` : key;

            const existingKey = this.translationKeys.get(fullKey) || {
              key,
              namespace,
              occurrences: [],
            };

            existingKey.occurrences.push({
              filePath,
              lineNumber: index + 1,
              context: line.trim(),
            });

            this.translationKeys.set(fullKey, existingKey);
          } catch (error) {
            this.log(
              `Error processing key in ${filePath}:${index + 1}: ${error.message}`,
              'error'
            );
          }
        }
      });
    });
  }

  public async scan(): Promise<Map<string, TranslationKey>> {
    try {
      const files = await this.findFiles();
      this.log(`Found ${files.length} files to scan`);

      for (const filePath of files) {
        try {
          const content = await fs.promises.readFile(filePath, 'utf-8');
          this.extractKeysFromContent(content, filePath);
          this.log(`Scanned ${filePath}`);
        } catch (error) {
          this.log(`Error reading file ${filePath}: ${error.message}`, 'error');
        }
      }

      return this.translationKeys;
    } catch (error) {
      this.log(`Scan failed: ${error.message}`, 'error');
      throw error;
    }
  }

  public generateReport(): string {
    const report = {
      totalKeys: this.translationKeys.size,
      keysByNamespace: {} as Record<string, number>,
      keys: Array.from(this.translationKeys.values()).map((key) => ({
        key: key.key,
        namespace: key.namespace || 'default',
        occurrences: key.occurrences.length,
        locations: key.occurrences.map((o) => `${o.filePath}:${o.lineNumber}`),
      })),
    };

    // Count keys by namespace
    for (const [, value] of this.translationKeys) {
      const namespace = value.namespace || 'default';
      report.keysByNamespace[namespace] = (report.keysByNamespace[namespace] || 0) + 1;
    }

    return JSON.stringify(report, null, 2);
  }
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('include', {
      type: 'array',
      description: 'Glob patterns for files to include',
      default: ['src/**/*.{ts,tsx,js,jsx}'],
    })
    .option('exclude', {
      type: 'array',
      description: 'Glob patterns for files to exclude',
      default: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    })
    .option('output', {
      type: 'string',
      description: 'Output file path for the report',
      default: 'translation-keys-report.json',
    })
    .option('verbose', {
      type: 'boolean',
      description: 'Enable verbose logging',
      default: false,
    })
    .help()
    .argv;

  try {
    const scanner = new TranslationScanner({
      include: argv.include as string[],
      exclude: argv.exclude as string[],
      verbose: argv.verbose,
    });

    await scanner.scan();
    const report = scanner.generateReport();

    await fs.promises.writeFile(argv.output, report);
    console.log(chalk.green(`\nReport generated successfully: ${argv.output}`));
  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}`));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { TranslationScanner }; 