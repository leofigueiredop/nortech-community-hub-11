import { SupportedLanguage } from './supportedLanguages';
import { SupportedNamespaces } from './types';

/**
 * Cache configuration options
 */
export interface CacheConfig {
  /** Time-to-live in seconds */
  ttl: number;
  /** Maximum cache size in bytes */
  maxSize: number;
  /** Whether to enable offline support */
  offlineSupport: boolean;
}

/**
 * Cache entry metadata
 */
interface CacheEntry {
  /** Translation data */
  data: Record<string, any>;
  /** When the entry was cached */
  timestamp: number;
  /** Version of the translations */
  version: string;
  /** Size of the data in bytes */
  size: number;
}

/**
 * Translation cache manager using IndexedDB
 */
export class TranslationCache {
  private readonly DB_NAME = 'translation-cache';
  private readonly STORE_NAME = 'translations';
  private readonly VERSION = 1;
  
  private db: IDBDatabase | null = null;
  private config: CacheConfig = {
    ttl: 24 * 60 * 60, // 24 hours
    maxSize: 5 * 1024 * 1024, // 5MB
    offlineSupport: true
  };
  
  /**
   * Initialize the cache database
   */
  async init(): Promise<void> {
    if (this.db) return;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.VERSION);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create store with indexes
        const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
        store.createIndex('timestamp', 'timestamp');
        store.createIndex('version', 'version');
      };
    });
  }
  
  /**
   * Get a cached translation
   */
  async get(language: SupportedLanguage, namespace: SupportedNamespaces, version: string): Promise<Record<string, any> | null> {
    await this.init();
    if (!this.db) return null;
    
    const key = this.getCacheKey(language, namespace);
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(this.STORE_NAME, 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(key);
      
      request.onsuccess = () => {
        const entry = request.result as CacheEntry | undefined;
        
        // Check if entry exists and is valid
        if (!entry || !this.isEntryValid(entry, version)) {
          resolve(null);
          return;
        }
        
        resolve(entry.data);
      };
      
      request.onerror = () => resolve(null);
    });
  }
  
  /**
   * Store a translation in the cache
   */
  async set(
    language: SupportedLanguage,
    namespace: SupportedNamespaces,
    version: string,
    data: Record<string, any>
  ): Promise<void> {
    await this.init();
    if (!this.db) return;
    
    const key = this.getCacheKey(language, namespace);
    const size = new TextEncoder().encode(JSON.stringify(data)).length;
    
    // Check if we need to clear space
    if (size > this.config.maxSize) {
      console.warn('Translation data exceeds maximum cache size');
      return;
    }
    
    await this.ensureCacheSpace(size);
    
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      version,
      size
    };
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(this.STORE_NAME, 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      store.put({ key, ...entry });
      transaction.oncomplete = () => resolve();
    });
  }
  
  /**
   * Clear expired or invalid entries
   */
  async cleanup(): Promise<void> {
    await this.init();
    if (!this.db) return;
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(this.STORE_NAME, 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('timestamp');
      
      const request = index.openCursor();
      
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) {
          resolve();
          return;
        }
        
        const entry = cursor.value as CacheEntry;
        if (!this.isEntryValid(entry, entry.version)) {
          cursor.delete();
        }
        
        cursor.continue();
      };
    });
  }
  
  /**
   * Update cache configuration
   */
  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
  
  /**
   * Check if a cache entry is valid
   */
  private isEntryValid(entry: CacheEntry, currentVersion: string): boolean {
    const age = Date.now() - entry.timestamp;
    return age < this.config.ttl * 1000 && entry.version === currentVersion;
  }
  
  /**
   * Generate a cache key for a language/namespace pair
   */
  private getCacheKey(language: SupportedLanguage, namespace: SupportedNamespaces): string {
    return `${language}:${namespace}`;
  }
  
  /**
   * Ensure there's enough space in the cache
   */
  private async ensureCacheSpace(requiredSize: number): Promise<void> {
    await this.init();
    if (!this.db) return;
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(this.STORE_NAME, 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('timestamp');
      
      let totalSize = 0;
      const request = index.openCursor();
      
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) {
          resolve();
          return;
        }
        
        const entry = cursor.value as CacheEntry;
        totalSize += entry.size;
        
        // If we exceed the limit, delete oldest entries
        if (totalSize + requiredSize > this.config.maxSize) {
          cursor.delete();
        }
        
        cursor.continue();
      };
    });
  }
}

export const translationCache = new TranslationCache(); 