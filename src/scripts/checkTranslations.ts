#!/usr/bin/env node

import { Command } from 'commander';
import { TranslationChecker } from '../utils/i18n/translationChecker';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const program = new Command();

program
  .name('check-translations')
  .description('Check translation completeness and generate a report')
  .option('-s, --source <pattern>', 'Source files pattern', 'src/**/*.{ts,tsx,js,jsx}')
  .option('-t, --translations <pattern>', 'Translation files pattern', 'public/locales/**/*.json')
  .option('-e, --exclude <patterns...>', 'Patterns to exclude', ['**/node_modules/**', '**/__tests__/**'])
  .option('-o, --output <file>', 'Output file for report', 'translation-check-report.md')
  .option('-i, --ignore <patterns...>', 'Translation keys to ignore (supports regex)')
  .option('-b, --base-language <lang>', 'Base language for comparisons', 'en-US')
  .option('--no-placeholders', 'Disable placeholder validation')
  .option('--no-html', 'Disable HTML tag validation')
  .option('--json', 'Output report in JSON format')
  .option('-v, --verbose', 'Show detailed information in console output')
  .parse(process.argv);

const options = program.opts();

// Convert ignore patterns to RegExp
const ignorePatterns = options.ignore
  ? options.ignore.map((pattern: string) => new RegExp(pattern))
  : [];

// Create checker instance
const checker = new TranslationChecker(
  options.source,
  options.translations,
  options.exclude,
  {
    ignorePatterns,
    baseLanguage: options.baseLanguage,
    validatePlaceholders: options.placeholders,
    validateHtml: options.html
  }
);

// Run check
const result = checker.check();

// Helper function to format severity
function formatSeverity(severity: string): string {
  switch (severity) {
    case 'error':
      return chalk.red('ERROR');
    case 'warning':
      return chalk.yellow('WARN');
    case 'info':
      return chalk.blue('INFO');
    default:
      return severity.toUpperCase();
  }
}

// Helper function to format issue details
function formatIssue(issue: any): string {
  const location = issue.file ? ` (${issue.file}:${issue.line})` : '';
  const namespace = issue.namespace ? `${issue.namespace}:` : '';
  return `${formatSeverity(issue.severity)} ${namespace}${issue.key}${location} - ${issue.details}`;
}

// Generate console output
console.log('\nTranslation Check Results:\n');

// Show statistics
Object.entries(result.stats).forEach(([lang, stats]) => {
  console.log(chalk.bold(`\n${lang}:`));
  console.log(`Total keys: ${stats.totalKeys}`);
  console.log(`Missing keys: ${chalk.red(stats.missingKeys)}`);
  console.log(`Empty translations: ${chalk.yellow(stats.emptyKeys)}`);
  console.log(`Inconsistent translations: ${chalk.yellow(stats.inconsistentKeys)}`);
  console.log(`Invalid translations: ${chalk.red(stats.invalidKeys)}`);
  console.log(`Unused keys: ${chalk.blue(stats.unusedKeys)}`);
  console.log(`Completion: ${chalk.green(stats.completionPercentage.toFixed(2))}%`);
});

// Show issues
if (options.verbose) {
  console.log('\nDetailed Issues:\n');
  result.issues.forEach(issue => {
    console.log(formatIssue(issue));
  });
}

// Generate report file
if (options.json) {
  // JSON report
  fs.writeFileSync(options.output, JSON.stringify(result, null, 2));
} else if (options.output.endsWith('.html')) {
  // HTML report
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Translation Check Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2rem; }
    h1, h2, h3 { color: #2d3748; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 2rem; }
    th, td { border: 1px solid #e2e8f0; padding: 0.5rem; text-align: left; }
    th { background: #f7fafc; }
    tr:nth-child(even) { background: #f1f5f9; }
    .error { color: #e53e3e; }
    .warning { color: #dd6b20; }
    .info { color: #3182ce; }
    .success { color: #38a169; }
    .config { font-size: 0.9em; background: #f7fafc; padding: 1em; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Translation Check Report</h1>
  <p>Generated on: ${new Date().toLocaleString()}</p>
  <h2>Statistics</h2>
  ${Object.entries(result.stats).map(([lang, stats]) => `
    <h3>${lang}</h3>
    <table>
      <tr><th>Metric</th><th>Count</th></tr>
      <tr><td>Total keys</td><td>${stats.totalKeys}</td></tr>
      <tr><td>Missing keys</td><td class="error">${stats.missingKeys}</td></tr>
      <tr><td>Empty translations</td><td class="warning">${stats.emptyKeys}</td></tr>
      <tr><td>Inconsistent translations</td><td class="warning">${stats.inconsistentKeys}</td></tr>
      <tr><td>Invalid translations</td><td class="error">${stats.invalidKeys}</td></tr>
      <tr><td>Unused keys</td><td class="info">${stats.unusedKeys}</td></tr>
      <tr><td>Completion</td><td class="success">${stats.completionPercentage.toFixed(2)}%</td></tr>
    </table>
  `).join('')}
  <h2>Issues</h2>
  <table>
    <tr><th>Severity</th><th>Language</th><th>Key</th><th>Location</th><th>Details</th></tr>
    ${result.issues.map(issue => {
      const location = issue.file ? `${issue.file}:${issue.line}` : 'N/A';
      const key = issue.namespace ? `${issue.namespace}:${issue.key}` : issue.key;
      return `<tr><td class="${issue.severity}">${issue.severity.toUpperCase()}</td><td>${issue.language || 'N/A'}</td><td>${key}</td><td>${location}</td><td>${issue.details}</td></tr>`;
    }).join('')}
  </table>
  <h2>Configuration</h2>
  <pre class="config">${JSON.stringify({
    sourcePattern: options.source,
    translationPattern: options.translations,
    excludePatterns: options.exclude,
    ignorePatterns: options.ignore || [],
    baseLanguage: options.baseLanguage,
    validatePlaceholders: options.placeholders,
    validateHtml: options.html
  }, null, 2)}</pre>
</body>
</html>`;
  fs.writeFileSync(options.output, html);
} else {
  // Markdown report
  const report = [
    '# Translation Check Report',
    `\nGenerated on: ${new Date().toLocaleString()}\n`,
    '## Statistics\n',
    ...Object.entries(result.stats).map(([lang, stats]) => [
      `### ${lang}\n`,
      '| Metric | Count |',
      '|--------|-------|',
      `| Total keys | ${stats.totalKeys} |`,
      `| Missing keys | ${stats.missingKeys} |`,
      `| Empty translations | ${stats.emptyKeys} |`,
      `| Inconsistent translations | ${stats.inconsistentKeys} |`,
      `| Invalid translations | ${stats.invalidKeys} |`,
      `| Unused keys | ${stats.unusedKeys} |`,
      `| Completion | ${stats.completionPercentage.toFixed(2)}% |`,
      ''
    ].join('\n')),
    '## Issues\n',
    '| Severity | Language | Key | Location | Details |',
    '|----------|----------|-----|----------|----------|',
    ...result.issues.map(issue => {
      const location = issue.file ? `${issue.file}:${issue.line}` : 'N/A';
      const key = issue.namespace ? `${issue.namespace}:${issue.key}` : issue.key;
      return `| ${issue.severity.toUpperCase()} | ${issue.language || 'N/A'} | ${key} | ${location} | ${issue.details} |`;
    }),
    '\n## Configuration\n',
    '```json',
    JSON.stringify({
      sourcePattern: options.source,
      translationPattern: options.translations,
      excludePatterns: options.exclude,
      ignorePatterns: options.ignore || [],
      baseLanguage: options.baseLanguage,
      validatePlaceholders: options.placeholders,
      validateHtml: options.html
    }, null, 2),
    '```'
  ].join('\n');

  fs.writeFileSync(options.output, report);
}

console.log(`\nReport saved to: ${path.resolve(options.output)}`);

// Exit with error if there are any error-level issues
const hasErrors = result.issues.some(issue => issue.severity === 'error');
process.exit(hasErrors ? 1 : 0); 