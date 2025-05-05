import { Plugin } from 'vite';
import path from 'path';
import { SupportedLanguage } from './supportedLanguages';
import { SupportedNamespaces } from './types';

/**
 * Vite plugin for hot reloading translations
 */
export function i18nHotReload(): Plugin {
  const TRANSLATION_PATH = /public\/locales\/([\w-]+)\/([\w-]+)\.json$/;

  return {
    name: 'i18n-hot-reload',
    apply: 'serve',
    configureServer(server) {
      // Watch translation files
      server.watcher.add('public/locales/**/*.json');

      server.watcher.on('change', (file) => {
        const match = path.normalize(file).match(TRANSLATION_PATH);
        if (!match) return;

        const [, language, namespace] = match;
        
        // Validate language and namespace
        if (!isValidLanguage(language) || !isValidNamespace(namespace)) {
          console.warn(`[i18n] Invalid translation file: ${file}`);
          return;
        }

        // Notify clients
        server.ws.send('i18n:update', {
          language: language as SupportedLanguage,
          namespace: namespace as SupportedNamespaces
        });
      });
    }
  };
}

/**
 * Type guard for supported languages
 */
function isValidLanguage(lang: string): lang is SupportedLanguage {
  return /^[a-z]{2}-[A-Z]{2}$/.test(lang);
}

/**
 * Type guard for supported namespaces
 */
function isValidNamespace(ns: string): ns is SupportedNamespaces {
  return ['common', 'navigation', 'forms', 'features', 'auth', 'plurals'].includes(ns);
} 