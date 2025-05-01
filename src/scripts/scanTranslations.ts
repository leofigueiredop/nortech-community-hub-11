#!/usr/bin/env node

import { Command } from 'commander';
import { TranslationScanner } from '../utils/i18n/translationScanner';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const program = new Command();

program
  .name('scan-translations')
  .description('Scan codebase for translation keys and compare with translation files')
  .option('-s, --source <pattern>', 'Source files pattern', 'src/**/*.{ts,tsx,js,jsx}')
  .option('-t, --translations <pattern>', 'Translation files pattern', 'public/locales/**/*.json')
  .option('-e, --exclude <patterns...>', 'Patterns to exclude', ['**/node_modules/**', '**/__tests__/**'])
  .option('-o, --output <file>', 'Output file for report', 'translation-scan-report.md')
  .parse(process.argv);

const options = program.opts();

// Create scanner instance
const scanner = new TranslationScanner(
  options.source,
  options.translations,
  options.exclude
);

// Run scan
console.log(chalk.blue('Scanning for translation keys...'));
const result = scanner.scan();

// Generate report
let report = '# Translation Scan Report\n\n';

// Summary
report += '## Summary\n\n';
report += `- Total keys used in code: ${result.usedKeys.length}\n`;

Object.entries(result.definedKeys).forEach(([lang, keys]) => {
  report += `\n### ${lang}\n`;
  report += `- Defined keys: ${keys.length}\n`;
  report += `- Missing keys: ${result.missingKeys[lang].length}\n`;
  report += `- Unused keys: ${result.unusedKeys[lang].length}\n`;
});

// Missing Keys
report += '\n## Missing Keys\n';
Object.entries(result.missingKeys).forEach(([lang, keys]) => {
  if (keys.length > 0) {
    report += `\n### ${lang}\n\n`;
    keys.forEach(key => {
      report += `- \`${key.key}\` ${key.namespace ? `(namespace: ${key.namespace})` : ''}\n`;
      report += `  - File: ${key.file}:${key.line}\n`;
    });
  }
});

// Unused Keys
report += '\n## Unused Keys\n';
Object.entries(result.unusedKeys).forEach(([lang, keys]) => {
  if (keys.length > 0) {
    report += `\n### ${lang}\n\n`;
    keys.forEach(key => {
      report += `- \`${key}\`\n`;
    });
  }
});

// Save report
fs.writeFileSync(options.output, report);
console.log(chalk.green(`\nReport saved to ${options.output}`));

// Print summary to console
console.log('\nSummary:');
Object.entries(result.definedKeys).forEach(([lang, keys]) => {
  console.log(`\n${chalk.yellow(lang)}:`);
  console.log(`- Defined keys: ${chalk.green(keys.length)}`);
  console.log(`- Missing keys: ${chalk.red(result.missingKeys[lang].length)}`);
  console.log(`- Unused keys: ${chalk.yellow(result.unusedKeys[lang].length)}`);
}); 