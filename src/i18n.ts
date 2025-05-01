import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend, { HttpBackendOptions } from 'i18next-http-backend';
import ICU from 'i18next-icu';
import { InitOptions } from 'i18next';
import { preloadHighPriorityNamespaces } from './utils/i18n/namespaceLoader';
import { cdnManager } from './utils/i18n/cdnConfig';
import { translationCache } from './utils/i18n/translationCache';

const config: InitOptions = {
  // Default language
  fallbackLng: {
    'pt-BR': ['en-US'], // Brazilian Portuguese falls back to English
    'default': ['en-US'] // All other languages fall back to English
  },
  
  // Supported languages
  supportedLngs: ['en-US', 'pt-BR'],
  
  // Default namespace
  defaultNS: 'common',
  
  // Initial namespaces to load
  ns: ['common', 'navigation'], // Only load critical namespaces initially
  
  // Fallback namespaces - if a key is not found in the current namespace, look in common
  fallbackNS: 'common',
  
  // Backend configuration
  backend: {
    // Custom loading function using CDN
    loadPath: (languages: string[], namespaces: string[]) => {
      return cdnManager.getTranslationUrl(languages[0] as any, namespaces[0] as any);
    },
    
    // Handle CDN failures
    request: async (options: HttpBackendOptions, url: string, _payload: unknown, callback: (error: unknown, response: unknown) => void) => {
      try {
        // Check cache first
        const [language, namespace] = url.split('/').slice(-2);
        const version = cdnManager.getCurrentVersion();
        const cachedData = await translationCache.get(
          language as any,
          namespace.replace('.json', '') as any,
          version
        );
        
        if (cachedData) {
          callback(null, cachedData);
          return;
        }
        
        // Fetch from CDN
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Cache the response
        await translationCache.set(
          language as any,
          namespace.replace('.json', '') as any,
          version,
          data
        );
        
        callback(null, data);
      } catch (error) {
        console.error('Failed to load translation:', error);
        callback(error, null);
      }
    }
  },
  
  // Detection configuration
  detection: {
    // Order of language detection
    order: ['querystring', 'localStorage', 'navigator'],
    
    // Cache user language
    caches: ['localStorage'],
    
    // Cookie configuration
    lookupQuerystring: 'lng',
    lookupLocalStorage: 'i18nextLng'
  },
  
  // Interpolation configuration
  interpolation: {
    escapeValue: false // React already escapes by default
  },
  
  // Performance options
  load: 'currentOnly', // Load only current language
  preload: ['en-US'], // Preload English translations
  
  // Debug mode (disable in production)
  debug: process.env.NODE_ENV === 'development',
  
  // React configuration
  react: {
    useSuspense: true,
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    nsMode: 'default'
  }
};

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(ICU)
  .use(initReactI18next)
  .init(config)
  .then(() => {
    // Preload high priority namespaces after initialization
    return preloadHighPriorityNamespaces();
  })
  .catch(error => {
    console.error('Failed to initialize i18next:', error);
  });

export default i18n; 