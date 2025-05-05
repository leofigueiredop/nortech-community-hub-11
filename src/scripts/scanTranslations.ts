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
  .option('-v, --verbose', 'Show detailed information in console output')
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
const timestamp = new Date().toISOString();
report += `Generated on: ${timestamp}\n\n`;

// Summary section
report += '## Summary\n\n';
report += `- Total keys used in code: ${result.usedKeys.length}\n`;
report += `- Source pattern: \`${options.source}\`\n`;
report += `- Translation pattern: \`${options.translations}\`\n`;
report += `- Excluded patterns: ${options.exclude.map(p => `\`${p}\``).join(', ')}\n\n`;

// Language-specific sections
Object.entries(result.definedKeys).forEach(([lang, keys]) => {
  const missingCount = result.missingKeys[lang].length;
  const unusedCount = result.unusedKeys[lang].length;
  const definedCount = keys.length;
  
  report += `## ${lang}\n\n`;
  report += `### Statistics\n\n`;
  report += `- Defined keys: ${definedCount}\n`;
  report += `- Missing keys: ${missingCount}\n`;
  report += `- Unused keys: ${unusedCount}\n`;
  report += `- Coverage: ${((definedCount - missingCount) / definedCount * 100).toFixed(1)}%\n\n`;

  if (missingCount > 0) {
    report += `### Missing Keys\n\n`;
    report += '| Key | File | Line |\n';
    report += '|-----|------|------|\n';
    result.missingKeys[lang].forEach(key => {
      const relativePath = path.relative(process.cwd(), key.file);
      report += `| \`${key.namespace ? `${key.namespace}:${key.key}` : key.key}\` | ${relativePath} | ${key.line} |\n`;
    });
    report += '\n';
  }

  if (unusedCount > 0) {
    report += `### Unused Keys\n\n`;
    report += '```\n';
    result.unusedKeys[lang].forEach(key => {
      report += `${key}\n`;
    });
    report += '```\n\n';
  }
});

// Add recommendations section
report += '## Recommendations\n\n';

const totalMissingKeys = Object.values(result.missingKeys).reduce((sum, keys) => sum + keys.length, 0);
const totalUnusedKeys = Object.values(result.unusedKeys).reduce((sum, keys) => sum + keys.length, 0);

if (totalMissingKeys > 0) {
  report += '### Missing Keys\n';
  report += '- Add the missing translations to maintain full internationalization coverage\n';
  report += '- Consider using a translation management system to track missing translations\n';
  report += '- Review the files where missing keys are used to ensure correct key names\n\n';
}

if (totalUnusedKeys > 0) {
  report += '### Unused Keys\n';
  report += '- Review and remove unused translations to keep files clean\n';
  report += '- Check if any unused keys are planned for future use\n';
  report += '- Consider archiving removed translations for reference\n\n';
}

// Save report
fs.writeFileSync(options.output, report);
console.log(chalk.green(`\nReport generated: ${options.output}`));

// Console output
console.log('\nSummary:');
console.log(chalk.blue(`Total keys used: ${result.usedKeys.length}`));

Object.entries(result.definedKeys).forEach(([lang, keys]) => {
  const missingCount = result.missingKeys[lang].length;
  const unusedCount = result.unusedKeys[lang].length;
  
  console.log(`\n${chalk.yellow(lang)}:`);
  console.log(`- Defined keys: ${chalk.white(keys.length)}`);
  console.log(`- Missing keys: ${chalk.red(missingCount)}`);
  console.log(`- Unused keys: ${chalk.yellow(unusedCount)}`);
  
  if (options.verbose && missingCount > 0) {
    console.log('\nMissing keys:');
    result.missingKeys[lang].forEach(key => {
      const relativePath = path.relative(process.cwd(), key.file);
      console.log(chalk.red(`- ${key.namespace ? `${key.namespace}:${key.key}` : key.key}`));
      console.log(`  at ${relativePath}:${key.line}`);
    });
  }
});

// Exit with error if there are missing keys
if (totalMissingKeys > 0) {
  process.exit(1);
} 